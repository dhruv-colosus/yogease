import { useEffect, useRef, useState } from "react";

interface Keypoint {
  point: number;
  x: string;
  y: string;
  z: string;
  visibility: string;
}

interface PoseData {
  predicted_class: number;
  predicted_pose: string;
  confidence: number;
  correction_feedback: string;
}

export const usePoseWebSocket = (keypoints: Keypoint[]) => {
  const [poseData, setPoseData] = useState<PoseData>({
    predicted_class: 5,
    predicted_pose: "Tadasana",
    confidence: 0,
    correction_feedback: "",
  });
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocketRef.current = new WebSocket(import.meta.env.REACT_APP_BACKEND_WS);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Prediction from server:", data);
      setPoseData(data);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ keypoints }));
    }
  }, [keypoints]);

  return poseData;
};
