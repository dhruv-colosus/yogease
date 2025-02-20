
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

interface PosePredictionProps {
    keypoints: Keypoint[];
    poseData: PoseData;
}

const POSE_MAPPING = {
    1: { name: "Vrikshasana", image: "/poses/1.jpeg" },
    2: { name: "Virabhadrasana", image: "/poses/2.jpeg" },
    3: { name: "Utkatasana", image: "/poses/3.png" },
    4: { name: "Trikonasana", image: "/poses/4.png" },
    5: { name: "Tadasana", image: "/poses/5.png" },
    6: { name: "Sarvangasana", image: "/poses/6.png" },
    7: { name: "Prasarita Padottanasana", image: "/poses/7.png" },
    8: { name: "Garudasana", image: "/poses/8.png" },
    9: { name: "Natarajasana", image: "/poses/9.jpeg" },
    10: { name: "Halasana", image: "/poses/10.png" },
    11: { name: "Dhanurasana", image: "/poses/11.jpeg" },
    12: { name: "Bhujangasana", image: "/poses/12.png" },
    13: { name: "Ardha Matsyendrasana", image: "/poses/13.png" }
} as const;

const PosePredictionMobile = ({ keypoints, poseData }: PosePredictionProps) => {
    const { predicted_class, predicted_pose, confidence } = poseData;
    const accuracy = Math.round(confidence * 100);

    return (
        <div className="absolute top-24 left-4 right-4 bg-black/40 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{predicted_pose}</h3>
                <span className="text-sm font-medium">{accuracy}%</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${accuracy}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PosePredictionMobile;
