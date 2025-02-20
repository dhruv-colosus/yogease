interface PoseCorrectionsProps {
    corrections: string;
}

const PoseCorrectionsMobile = ({ corrections }: PoseCorrectionsProps) => {
    const formatCorrections = (corrections: string) => {
        return corrections.split('\n').filter(line => line.trim().length > 0).slice(0, 2);
    };

    if (!corrections?.length) return (
        <div className="rounded-3xl bg-black/30 backdrop-blur-lg p-6 border border-white/10 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Real-time Corrections</h2>
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12H3l9-9 9 9h-2m-8 5v-8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17h10v4H7v-4z" />
                    </svg>
                    <span className="text-yellow-500 font-medium">Ready</span>
                </div>
            </div>
            <ul className="space-y-2 font-mono text-gray-300">
                <li>No Pose Detected</li>
            </ul>
        </div>
    );

    const correctionLines = formatCorrections(corrections);

    return (
        <div className="rounded-3xl bg-black/50 backdrop-blur-lg p-6 border border-white/20 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Real-time Corrections</h2>
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12H3l9-9 9 9h-2m-8 5v-8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17h10v4H7v-4z" />
                    </svg>
                    <span className="text-green-500 font-medium">Active</span>
                </div>
            </div>
            <ul className="space-y-2 font-mono text-gray-300 ">
                {correctionLines.map((correction, index) => (
                    <li key={index}>{correction}</li>
                ))}
            </ul>
        </div>
    );
};

export default PoseCorrectionsMobile; 