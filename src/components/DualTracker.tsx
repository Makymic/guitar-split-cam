import React, { useEffect, useRef, useState } from 'react';
import {
  FilesetResolver,
  HandLandmarker,
  FaceLandmarker,
} from '@mediapipe/tasks-vision';

interface DualTrackerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const DualTracker: React.FC<DualTrackerProps> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const landmarkersRef = useRef<{
    hand?: HandLandmarker;
    face?: FaceLandmarker;
  }>({});

  // 1. Initialize MediaPipe Face & Hand Models
  useEffect(() => {
    let isMounted = true;

    async function initTrackers() {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      if (isMounted) {
        landmarkersRef.current = { hand: handLandmarker, face: faceLandmarker };
        setIsLoaded(true);
      }
    }

    initTrackers();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const { hand, face } = landmarkersRef.current;

      if (video && canvas && hand && face && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const nowInMs = performance.now();

          const handResults = hand.detectForVideo(video, nowInMs);
          const faceResults = face.detectForVideo(video, nowInMs);

          // Draw Face Landmarks (Cyan)
          if (faceResults.faceLandmarks) {
            for (const landmarks of faceResults.faceLandmarks) {
              ctx.fillStyle = '#06b6d4';
              landmarks.forEach((pt) => {
                ctx.beginPath();
                ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1.5, 0, 2 * Math.PI);
                ctx.fill();
              });
            }
          }

          // Draw Hand Landmarks (Emerald)
          if (handResults.landmarks) {
            for (const landmarks of handResults.landmarks) {
              ctx.fillStyle = '#10b981';
              landmarks.forEach((pt) => {
                ctx.beginPath();
                ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 3, 0, 2 * Math.PI);
                ctx.fill();
              });
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    if (isLoaded) {
      renderLoop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};