import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Camera as Cam, BatteryMedium, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Pose } from '@mediapipe/pose';
// import { Camera } from '@mediapipe/camera_utils';
// import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import PosePrediction from "@/components/pose-prediction";
import { usePoseWebSocket } from '../utils/usePoseWebSocket';
import PoseCorrections from '../components/PoseCorrections';
import PoseCorrectionsMobile from "@/components/pose-correction-mobile";
import PosePredictionMobile from "@/components/pose-prediction-mobile";

declare global {
  interface Window {
    Pose: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
  }
}

interface Keypoint {
  point: number;
  x: string;
  y: string;
  z: string;
  visibility: string;
}

const Yoga = () => {
  const [accuracy, setAccuracy] = useState<number>(0);
  const [currentPose, setCurrentPose] = useState<string>("Mountain Pose");
  const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
  const [showConsent, setShowConsent] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const poseData = usePoseWebSocket(keypoints);
  useEffect(() => {
    navigator.permissions.query({ name: 'camera' as PermissionName })
      .then((permissionStatus) => {
        setCameraPermission(permissionStatus.state);
        setShowConsent(permissionStatus.state === 'prompt');

        permissionStatus.onchange = () => {
          setCameraPermission(permissionStatus.state);
          setShowConsent(permissionStatus.state === 'prompt');
        };
      });
  }, []);

  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setShowConsent(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowConsent(true);
    }
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    if (!window.Pose || !window.Camera) {
      console.error("MediaPipe libraries not loaded");
      return;
    }

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    videoElement.width = 640;
    videoElement.height = 480;
    canvasElement.width = 640;
    canvasElement.height = 480;

    const pose = new window.Pose({
      locateFile: (file) => `/mediapipe/${file}`,

    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      enableSegmentation: true,
    });

    pose.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        const newKeypoints = results.poseLandmarks.map((landmark, index) => ({
          point: index,
          x: landmark.x.toFixed(3),
          y: landmark.y.toFixed(3),
          z: landmark.z.toFixed(3),
          visibility: landmark.visibility.toFixed(3)
        }));
        setKeypoints(newKeypoints);
        console.log('Pose Landmarks:', newKeypoints);

        window.drawConnectors(
          canvasCtx,
          results.poseLandmarks,
          [[0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
          [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
          [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23],
          [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29],
          [28, 30], [29, 31], [30, 32]],
          { color: 'rgb(255, 215, 184,0.5)', lineWidth: 2 }
        );

        window.drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: 'rgb(255, 111, 0,0.6)',
          lineWidth: 1,
          radius: 3,
        });
      }
      canvasCtx.restore();
    });

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2d2d2d] text-white">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <Navbar />

      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-2xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <Cam className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-medium">Camera Access Required</h2>
            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6"
                alt="Privacy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-gray-400 text-sm space-y-4">
              <p>
                YogEase needs access to your camera to provide real-time pose detection and feedback.
                We value your privacy and ensure that:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span>Your video stream never leaves your device</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span>No recordings are stored or transmitted</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-primary mr-2" />
                  <span>All processing is done locally on your device</span>
                </li>
              </ul>
            </div>
            <button
              onClick={requestCameraAccess}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-sm font-medium transition-all w-full"
            >
              I Understand, Enable Camera
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:grid md:grid-cols-[5fr,2fr] gap-6">
            <div className="rounded-3xl bg-black/30 backdrop-blur-lg p-4 border border-white/10 h-full">
              <div className="aspect-video relative rounded-2xl overflow-hidden bg-black/50">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                ></video>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                ></canvas>
              </div>
              <PoseCorrections corrections={poseData.correction_feedback} />

            </div>

            <div className="space-y-6">
              <PosePrediction
                keypoints={keypoints}
                poseData={poseData}
              />
            </div>

          </div>

          {/* Mobile Layout */}
          <div className="md:hidden relative h-screen -mt-20">
            {/* Full Screen Video */}
            <div className="absolute inset-0 bg-black/50">
              <div className="h-full flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                ></video>

              </div>
            </div>

            <div className="absolute top-24 left-4 right-4 bg-black/40 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{currentPose}</h3>
                <span className="text-sm font-medium">{accuracy}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>

            <PosePredictionMobile
              keypoints={keypoints}
              poseData={poseData}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg rounded-t-3xl p-2">
              <PoseCorrectionsMobile corrections={poseData.correction_feedback} />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Yoga;
