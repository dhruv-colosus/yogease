from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import numpy as np
from tensorflow.keras.models import load_model
import os
app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = 'sample-dataset'  

MODEL_PATH = "yoga_poses_model_mini.h5"  # Adjust path as needed
model = load_model(MODEL_PATH)
model.compile(optimizer="Adam", loss="categorical_crossentropy", metrics=["categorical_accuracy"])
pose_folders = [f for f in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, f))]

with open("average_keypoints.json", "r") as f:
    reference_keypoints_dict = json.load(f)

# Convert each reference pose's keypoints to a NumPy array of floats.
for pose_name in reference_keypoints_dict:
    # Expecting each value to be a list of lists (each inner list: [x, y, z, visibility])
    reference_keypoints_dict[pose_name] = np.array(reference_keypoints_dict[pose_name], dtype=np.float32)

# Determine available pose names (used to map predicted indices to names)
pose_folders = list(reference_keypoints_dict.keys())


def process_keypoints(keypoints):
    """
    Convert a list of keypoint dictionaries to a flat NumPy array of floats.
    Each keypoint dict should have keys: "x", "y", "z", "visibility".
    """
    processed = []
    for kp in keypoints:
        processed.extend([
            float(kp.get("x", 0)),
            float(kp.get("y", 0)),
            float(kp.get("z", 0)),
            float(kp.get("visibility", 0))
        ])
    return np.array(processed, dtype=np.float32)


def calculate_joint_angle(p1, p2, p3):
    """
    Calculate the angle (in degrees) between three 3D points.
    p1, p2, p3 are NumPy arrays with shape (3,)
    """
    v1 = p1 - p2
    v2 = p3 - p2
    cosine_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8)
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return np.degrees(angle)


def calculate_angles(keypoints):
    """
    Calculate joint angles from keypoints.
    Keypoints should be reshaped to (-1, 4) where columns are [x, y, z, visibility].
    Returns a dictionary of calculated angles.
    """
    kp = keypoints.reshape(-1, 4)[:, :3]  # take only x, y, z
    angles = {}

    # Left arm: using landmarks 11 (shoulder), 13 (elbow), 15 (wrist)
    angles["left_arm"] = calculate_joint_angle(kp[11], kp[13], kp[15])
    # Right arm: using landmarks 12 (shoulder), 14 (elbow), 16 (wrist)
    angles["right_arm"] = calculate_joint_angle(kp[12], kp[14], kp[16])
    # Left leg: using landmarks 23 (hip), 25 (knee), 27 (ankle)
    angles["left_leg"] = calculate_joint_angle(kp[23], kp[25], kp[27])
    # Right leg: using landmarks 24 (hip), 26 (knee), 28 (ankle)
    angles["right_leg"] = calculate_joint_angle(kp[24], kp[26], kp[28])
    # Spine: using midpoint of shoulders, hips, and knees
    spine_top = (kp[11] + kp[12]) / 2
    spine_mid = (kp[23] + kp[24]) / 2
    spine_bottom = (kp[25] + kp[26]) / 2
    angles["spine"] = calculate_joint_angle(spine_top, spine_mid, spine_bottom)

    return angles


def calculate_correction_metrics(detected_keypoints, reference_keypoints):
    """
    Calculate a correction metric by comparing the detected and reference keypoints.
    Returns:
      - correction_metric: a combined metric (normalized 0-1)
      - angle_differences: per joint angle differences and direction
      - depth_metric: average difference in the z-coordinate (depth)
    """
    detected_angles = calculate_angles(detected_keypoints)
    reference_angles = calculate_angles(reference_keypoints)

    joint_weights = {
        "spine": 0.35,
        "left_arm": 0.15,
        "right_arm": 0.15,
        "left_leg": 0.175,
        "right_leg": 0.175
    }

    angle_differences = {}
    for joint in detected_angles:
        diff = abs(detected_angles[joint] - reference_angles[joint])
        direction = "higher" if detected_angles[joint] > reference_angles[joint] else "lower"
        angle_differences[joint] = {"difference": diff, "direction": direction}

    weighted_angle_metric = sum(
        angle_differences[joint]["difference"] * joint_weights.get(joint, 0)
        for joint in joint_weights
    ) / 180.0  # normalize

    # For position metric, compute average absolute difference of x, y, z
    position_diff = np.abs(detected_keypoints - reference_keypoints).reshape(-1, 4)[:, :3]
    position_metric = np.mean(position_diff)

    # Depth metric: average difference in the z-coordinate
    depth_diff = np.abs(detected_keypoints.reshape(-1, 4)[:, 2] - reference_keypoints.reshape(-1, 4)[:, 2])
    depth_metric = np.mean(depth_diff)

    correction_metric = 0.5 * weighted_angle_metric + 0.3 * position_metric + 0.2 * depth_metric
    return correction_metric, angle_differences, depth_metric


def generate_correction_feedback(correction_metric, angle_differences, depth_metric):
    """
    Generate textual feedback based on correction metrics.
    """
    feedback_lines = []
    if correction_metric < 0.08:
        feedback_lines.append("Perfect form! Keep holding this position.")
    elif correction_metric < 0.15:
        feedback_lines.append("Very good form with minimal adjustments needed.")
    elif correction_metric < 0.25:
        feedback_lines.append("Good effort! Some adjustments will help perfect your pose.")
    elif correction_metric < 0.35:
        feedback_lines.append("You're on the right track, but several adjustments are needed.")
    else:
        feedback_lines.append("Let's work on getting the basic alignment right.")

    # Joint-specific feedback (if angle difference exceeds 15°)
    for joint, data in angle_differences.items():
        if data["difference"] > 15:
            intensity = (
                "slightly" if data["difference"] < 25 else
                "moderately" if data["difference"] < 40 else
                "significantly"
            )
            if joint == "spine":
                if data["direction"] == "higher":
                    feedback_lines.append(f"Your back is {intensity} tilted; try to straighten it.")
                else:
                    feedback_lines.append(f"Your back is {intensity} slouched; work on straightening it.")
            else:
                action = "lower" if data["direction"] == "higher" else "raise"
                feedback_lines.append(f"Adjust your {joint.replace('_', ' ')}: {intensity} {action} it.")

    if depth_metric > 0.1:
        feedback_lines.append("Try to maintain a more consistent depth in your pose.")

    return "\n".join(feedback_lines)



@app.websocket("/predict")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive keypoints from the client as a JSON string
            data = await websocket.receive_text()
            payload = json.loads(data)
            keypoints = payload.get("keypoints")
            if keypoints is None:
                await websocket.send_text(json.dumps({"error": "No keypoints provided."}))
                continue

            # Process keypoints: convert the list of dicts to a flat NumPy array of floats
            keypoints_np = process_keypoints(keypoints)
            keypoints_np = keypoints_np.reshape(1, -1)  # Reshape for model input

            # Run prediction
            prediction = model.predict(keypoints_np)
            predicted_class = int(np.argmax(prediction, axis=1)[0])
            confidence = float(np.max(prediction, axis=1)[0])
            predicted_pose = pose_folders[predicted_class]
            # Send the result back to the client
            reference = reference_keypoints_dict.get(predicted_pose)
            if reference is None:
                correction_feedback = "Reference pose not available for correction."
            else:
                # Ensure both detected and reference keypoints are in the same shape.
                detected_reshaped = keypoints_np.reshape(-1, 4)
                reference_reshaped = reference.reshape(-1, 4)
                correction_metric, angle_differences, depth_metric = calculate_correction_metrics(
                    detected_reshaped, reference_reshaped
                )
                correction_feedback = generate_correction_feedback(correction_metric, angle_differences, depth_metric)

            # Combine classification and correction feedback into one result.
            result = {
                "predicted_class": predicted_class,
                "predicted_pose": predicted_pose,
                "confidence": confidence,
                "correction_feedback": correction_feedback,
            }
            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        print("Client disconnected")
