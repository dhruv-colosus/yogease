
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

const PosePrediction = ({ keypoints, poseData }: PosePredictionProps) => {
    const { predicted_class, predicted_pose, confidence } = poseData;
    const accuracy = Math.round(confidence * 100);

    return (
        <div className="rounded-3xl bg-black/30 backdrop-blur-lg p-6 border border-white/10">
            <h2 className="text-2xl font-medium mb-4">Pose Analysis</h2>

            <div className="mb-6">
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-black/50 relative">
                        {accuracy < 85 ? (
                            <div className="absolute inset-0 bg-white/10 flex items-center justify-center flex-col">
                                <p className="text-xl font-medium text-white text-center">No pose detected</p>
                                <p className="text-sm text-white/70 text-center mt-2">Try with Padmasana maybe</p>
                            </div>
                        ) : (
                            <img
                                src={POSE_MAPPING[predicted_class]?.image || "https://images.unsplash.com/photo-1506126613408-eca07ce68773"}
                                alt={predicted_pose}
                                className="object-cover w-full h-full"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium">
                            {accuracy < 85 ? "No pose detected" : predicted_pose}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${accuracy}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium">{accuracy}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Keypoints Data</h3>
                <div className="max-h-[100px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="text-left py-2">Point</th>
                                <th className="text-left py-2">X</th>
                                <th className="text-left py-2">Y</th>
                                <th className="text-left py-2">Z</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keypoints.map((kp) => (
                                <tr key={kp.point} className="text-gray-300 border-t border-white/10">
                                    <td className="py-2">{kp.point}</td>
                                    <td className="py-2">{kp.x}</td>
                                    <td className="py-2">{kp.y}</td>
                                    <td className="py-2">{kp.z}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PosePrediction;
