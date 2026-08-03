import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Hands: any;
    FaceDetection: any;
    Camera: any;
  }
}

// Chromatic Note Calculation Helper
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getPitchData(frequency: number) {
  const noteNum = 12 * Math.log2(frequency / 440) + 69;
  const roundedNote = Math.round(noteNum);
  const noteName = NOTE_NAMES[(roundedNote % 12 + 12) % 12];
  const octave = Math.floor(roundedNote / 12) - 1;
  const targetFreq = 440 * Math.pow(2, (roundedNote - 69) / 12);
  const cents = Math.floor(1200 * Math.log2(frequency / targetFreq));

  return {
    note: `${noteName}${octave}`,
    cents: Math.max(-50, Math.min(50, cents)),
    frequency: frequency.toFixed(1)
  };
}

// Pitch Detection via Autocorrelation
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.015) return -1;

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  const slicedBuf = buf.slice(r1, r2);
  const slicedSize = slicedBuf.length;

  const c = new Array(slicedSize).fill(0);
  for (let i = 0; i < slicedSize; i++) {
    for (let j = 0; j < slicedSize - i; j++) {
      c[i] = c[i] + slicedBuf[j] * slicedBuf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < slicedSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export default function DesktopApp() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraInstanceRef = useRef<any>(null);

  // Layout & Feature Toggles
  const [showFaceCam, setShowFaceCam] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isFaceScriptLoaded, setIsFaceScriptLoaded] = useState(false);

  // Recording Refs & State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Tuner State
  const [showTuner, setShowTuner] = useState(false);
  const [tunerData, setTunerData] = useState<{ note: string; cents: number; frequency: string } | null>(null);
  const tunerAudioContextRef = useRef<AudioContext | null>(null);
  const tunerStreamRef = useRef<MediaStream | null>(null);
  const tunerAnimFrameRef = useRef<number | null>(null);

  // Devices State
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');

  // Smooth camera panning state refs
  const leftPanRef = useRef<{ x: number; y: number }>({ x: 0.25, y: 0.5 });
  const facePanRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.35 });
  const rightPanRef = useRef<{ x: number; y: number }>({ x: 0.75, y: 0.5 });

  // Tracking Lock States
  const [lockLeftPan, setLockLeftPan] = useState(false);
  const [lockRightPan, setLockRightPan] = useState(false);

  const lockLeftPanRef = useRef(lockLeftPan);
  const lockRightPanRef = useRef(lockRightPan);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const zoomLevelRef = useRef(zoomLevel);

  // Auto-inject Face Detection script dynamically
  useEffect(() => {
    if (window.FaceDetection) {
      setIsFaceScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      setIsFaceScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    lockLeftPanRef.current = lockLeftPan;
  }, [lockLeftPan]);

  useEffect(() => {
    lockRightPanRef.current = lockRightPan;
  }, [lockRightPan]);

  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

  // Recording Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const refreshDevices = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const vDevices = allDevices.filter((d) => d.kind === 'videoinput' && d.deviceId !== '');
      const aDevices = allDevices.filter((d) => d.kind === 'audioinput' && d.deviceId !== '');
      
      setVideoDevices(vDevices);
      setAudioDevices(aDevices);

      if (vDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(vDevices[0].deviceId);
      }
      if (aDevices.length > 0 && !selectedAudioId) {
        setSelectedAudioId(aDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  // Real-Time Guitar Tuner Engine Effect
  useEffect(() => {
    if (!showTuner) {
      if (tunerAnimFrameRef.current) cancelAnimationFrame(tunerAnimFrameRef.current);
      if (tunerAudioContextRef.current) tunerAudioContextRef.current.close();
      if (tunerStreamRef.current) tunerStreamRef.current.getTracks().forEach((t) => t.stop());
      setTunerData(null);
      return;
    }

    let isTunerActive = true;

    const startTuner = async () => {
      try {
        const audioConstraints: MediaTrackConstraints | boolean = selectedAudioId
          ? { deviceId: { exact: selectedAudioId } }
          : true;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        if (!isTunerActive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        tunerStreamRef.current = stream;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        tunerAudioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const buffer = new Float32Array(analyser.fftSize);

        const updatePitch = () => {
          if (!isTunerActive) return;
          analyser.getFloatTimeDomainData(buffer);
          const pitch = autoCorrelate(buffer, audioCtx.sampleRate);

          if (pitch !== -1 && pitch > 50 && pitch < 1000) {
            setTunerData(getPitchData(pitch));
          } else {
            setTunerData(null);
          }

          tunerAnimFrameRef.current = requestAnimationFrame(updatePitch);
        };

        updatePitch();
      } catch (err) {
        console.error('Tuner audio initialization failed:', err);
      }
    };

    startTuner();

    return () => {
      isTunerActive = false;
      if (tunerAnimFrameRef.current) cancelAnimationFrame(tunerAnimFrameRef.current);
      if (tunerAudioContextRef.current) tunerAudioContextRef.current.close();
      if (tunerStreamRef.current) tunerStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [showTuner, selectedAudioId]);

  // Synchronized Non-Blocking Render Loop & Computer Vision Pipeline
  useEffect(() => {
    let isActive = true;
    let animFrameId: number;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement || !window.Hands || !window.Camera) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    if (cameraInstanceRef.current) {
      cameraInstanceRef.current.stop();
    }

    // Smooth 60FPS Continuous Render Loop
    const renderLoop = () => {
      if (!isActive) return;

      if (videoElement.readyState >= 2) {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvasElement.clientWidth;
        const displayHeight = canvasElement.clientHeight;

        if (canvasElement.width !== displayWidth * dpr || canvasElement.height !== displayHeight * dpr) {
          canvasElement.width = displayWidth * dpr;
          canvasElement.height = displayHeight * dpr;
        }

        canvasCtx.save();
        canvasCtx.scale(dpr, dpr);
        canvasCtx.clearRect(0, 0, displayWidth, displayHeight);

        const isVert = layoutMode === 'vertical';
        const numPanels = showFaceCam ? 3 : 2;
        
        const panelWidth = isVert ? displayWidth : displayWidth / numPanels;
        const panelHeight = isVert ? displayHeight / numPanels : displayHeight;
        const zoom = zoomLevelRef.current;

        canvasCtx.fillStyle = '#18181b';
        canvasCtx.fillRect(0, 0, displayWidth, displayHeight);

        const imgWidth = videoElement.videoWidth || 1280;
        const imgHeight = videoElement.videoHeight || 720;

        const aspect = panelWidth / panelHeight;
        const imgAspect = imgWidth / imgHeight;

        let renderW = imgWidth;
        let renderH = imgHeight;

        if (imgAspect > aspect) {
          renderW = imgHeight * aspect;
        } else {
          renderH = imgWidth / aspect;
        }

        renderW = renderW / zoom;
        renderH = renderH / zoom;

        const drawMirroredView = (xOffset: number, yOffset: number, panX: number, panY: number) => {
          let sx = panX * imgWidth - renderW / 2;
          let sy = panY * imgHeight - renderH / 2;

          sx = Math.max(0, Math.min(imgWidth - renderW, sx));
          sy = Math.max(0, Math.min(imgHeight - renderH, sy));

          canvasCtx.save();
          canvasCtx.beginPath();
          canvasCtx.rect(xOffset, yOffset, panelWidth, panelHeight);
          canvasCtx.clip();

          canvasCtx.translate(xOffset + panelWidth, yOffset);
          canvasCtx.scale(-1, 1);

          canvasCtx.drawImage(
            videoElement,
            sx, sy, renderW, renderH,
            0, 0, panelWidth, panelHeight
          );

          canvasCtx.restore();
        };

        if (showFaceCam) {
          if (isVert) {
            drawMirroredView(0, 0, leftPanRef.current.x, leftPanRef.current.y);
            drawMirroredView(0, panelHeight, facePanRef.current.x, facePanRef.current.y);
            drawMirroredView(0, panelHeight * 2, rightPanRef.current.x, rightPanRef.current.y);
          } else {
            drawMirroredView(0, 0, leftPanRef.current.x, leftPanRef.current.y);
            drawMirroredView(panelWidth, 0, facePanRef.current.x, facePanRef.current.y);
            drawMirroredView(panelWidth * 2, 0, rightPanRef.current.x, rightPanRef.current.y);
          }
        } else {
          if (isVert) {
            drawMirroredView(0, 0, leftPanRef.current.x, leftPanRef.current.y);
            drawMirroredView(0, panelHeight, rightPanRef.current.x, rightPanRef.current.y);
          } else {
            drawMirroredView(0, 0, leftPanRef.current.x, leftPanRef.current.y);
            drawMirroredView(panelWidth, 0, rightPanRef.current.x, rightPanRef.current.y);
          }
        }

        // Panel Dividers
        canvasCtx.strokeStyle = '#3f3f46';
        canvasCtx.lineWidth = 3;
        canvasCtx.beginPath();
        if (isVert) {
          canvasCtx.moveTo(0, panelHeight);
          canvasCtx.lineTo(displayWidth, panelHeight);
          if (showFaceCam) {
            canvasCtx.moveTo(0, panelHeight * 2);
            canvasCtx.lineTo(displayWidth, panelHeight * 2);
          }
        } else {
          canvasCtx.moveTo(panelWidth, 0);
          canvasCtx.lineTo(panelWidth, displayHeight);
          if (showFaceCam) {
            canvasCtx.moveTo(panelWidth * 2, 0);
            canvasCtx.lineTo(panelWidth * 2, displayHeight);
          }
        }
        canvasCtx.stroke();

        canvasCtx.restore();
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    // Kick off independent render loop
    animFrameId = requestAnimationFrame(renderLoop);

    // Hands Tracker Setup
    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: any) => {
      if (!isActive) return;

      if (results.multiHandLandmarks && results.multiHandedness) {
        let leftTarget = { ...leftPanRef.current };
        let rightTarget = { ...rightPanRef.current };

        results.multiHandedness.forEach((handedness: any, index: number) => {
          const label = handedness.label;
          const landmarks = results.multiHandLandmarks[index];

          if (landmarks && landmarks.length > 0) {
            let sumX = 0;
            let sumY = 0;
            for (const pt of landmarks) {
              sumX += pt.x;
              sumY += pt.y;
            }
            const avgX = sumX / landmarks.length;
            const avgY = sumY / landmarks.length;

            if (label === 'Right' && !lockLeftPanRef.current) {
              leftTarget = { x: avgX, y: avgY };
            } else if (label === 'Left' && !lockRightPanRef.current) {
              rightTarget = { x: avgX, y: avgY };
            }
          }
        });

        const lerpFactor = 0.1;
        if (!lockLeftPanRef.current) {
          leftPanRef.current.x += (leftTarget.x - leftPanRef.current.x) * lerpFactor;
          leftPanRef.current.y += (leftTarget.y - leftPanRef.current.y) * lerpFactor;
        }

        if (!lockRightPanRef.current) {
          rightPanRef.current.x += (rightTarget.x - rightPanRef.current.x) * lerpFactor;
          rightPanRef.current.y += (rightTarget.y - rightPanRef.current.y) * lerpFactor;
        }
      }
    });

    // Face Detection Setup
    let faceDetector: any = null;
    let faceInterval: any = null;

    if (window.FaceDetection && showFaceCam && isFaceScriptLoaded) {
      try {
        faceDetector = new window.FaceDetection({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
        });

        faceDetector.setOptions({
          modelSelection: 0,
          minDetectionConfidence: 0.5
        });

        faceDetector.onResults((faceResults: any) => {
          if (!isActive) return;

          if (faceResults.detections && faceResults.detections.length > 0) {
            const bbox = faceResults.detections[0].locationData.relativeBoundingBox;
            const faceCenterX = bbox.x + bbox.width / 2;
            const faceCenterY = bbox.y + bbox.height / 2;

            const lerpFactor = 0.1;
            facePanRef.current.x += (faceCenterX - facePanRef.current.x) * lerpFactor;
            facePanRef.current.y += (faceCenterY - facePanRef.current.y) * lerpFactor;
          }
        });

        // Run face detection on a lightweight 200ms background interval (~5 FPS) to prevent locks
        faceInterval = setInterval(() => {
          if (isActive && videoElement && videoElement.readyState >= 2 && faceDetector) {
            faceDetector.send({ image: videoElement }).catch(() => {});
          }
        }, 200);

      } catch (err) {
        console.warn('FaceDetector initialization error:', err);
      }
    }

    // Dedicated Camera Stream Handler
    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (isActive && videoElement && videoElement.readyState >= 2) {
          await hands.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    cameraInstanceRef.current = camera;

    if (videoElement.srcObject) {
      const activeStream = videoElement.srcObject as MediaStream;
      activeStream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }

    const primaryConstraints: MediaStreamConstraints = {
      video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
    };

    const startStream = async (constraints: MediaStreamConstraints) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isActive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        videoElement.srcObject = stream;
        await refreshDevices();

        await videoElement.play();
        if (isActive) {
          camera.start();
        }
      } catch (err) {
        console.warn('Primary device stream connection failed:', err);
      }
    };

    startStream(primaryConstraints);

    return () => {
      isActive = false;
      cancelAnimationFrame(animFrameId);
      if (faceInterval) clearInterval(faceInterval);
      camera.stop();
      hands.close();
      if (faceDetector) faceDetector.close();
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId, layoutMode, showFaceCam, isFaceScriptLoaded]);

  // Start / Stop Recording Handler
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
      setIsRecording(false);
    } else {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      try {
        const videoTrackStream = canvasElement.captureStream(60);
        let combinedStream = videoTrackStream;

        const audioConstraints: MediaTrackConstraints | boolean = selectedAudioId
          ? { deviceId: { exact: selectedAudioId } }
          : true;

        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
          audioStreamRef.current = micStream;

          combinedStream = new MediaStream([
            ...videoTrackStream.getVideoTracks(),
            ...micStream.getAudioTracks()
          ]);
        } catch (audioErr) {
          console.warn('Mic access failed, recording video only:', audioErr);
        }

        recordedChunksRef.current = [];

        let mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }

        const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `guitar-take-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        };

        mediaRecorder.start(1000);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to initiate recording stream:', err);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getCanvasAspectRatio = () => {
    const numPanels = showFaceCam ? 3 : 2;
    if (layoutMode === 'horizontal') {
      return `${numPanels}/1`;
    } else {
      return `1/${numPanels}`;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#09090b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '1.25rem',
      color: '#fff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header Bar Controls */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '8px 16px',
        backgroundColor: '#18181b',
        borderRadius: '10px',
        border: '1px solid #27272a'
      }}>
        <h1 style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold',
          margin: 0,
          color: '#f4f4f5'
        }}>
          Guitar Split-Cam
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'nowrap'
        }}>
          <button
            onClick={() => setShowFaceCam((prev) => !prev)}
            style={{
              padding: '6px 12px',
              backgroundColor: showFaceCam ? '#059669' : '#27272a',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            👤 {showFaceCam ? 'Face On' : 'Face Off'}
          </button>

          <button
            onClick={() => setLayoutMode((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))}
            style={{
              padding: '6px 12px',
              backgroundColor: '#27272a',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {layoutMode === 'horizontal' ? '↕ Vertical' : '↔ Horizontal'}
          </button>

          <button
            onClick={() => setShowTuner((prev) => !prev)}
            style={{
              padding: '6px 12px',
              backgroundColor: showTuner ? '#2563eb' : '#27272a',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            🎸 Tuner
          </button>

          <button
            onClick={toggleRecording}
            style={{
              padding: '6px 12px',
              backgroundColor: isRecording ? '#dc2626' : '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {isRecording ? '⏹ Stop' : '⏺ Record'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', marginLeft: '4px' }}>
            <span>🔍</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              style={{ cursor: 'pointer', width: '70px' }}
            />
          </div>

          {videoDevices.length > 0 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              style={{
                padding: '5px 8px',
                backgroundColor: '#27272a',
                color: '#ffffff',
                border: '1px solid #3f3f46',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
            >
              {videoDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  📷 {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          )}

          {audioDevices.length > 0 && (
            <select
              value={selectedAudioId}
              onChange={(e) => setSelectedAudioId(e.target.value)}
              disabled={isRecording}
              style={{
                padding: '5px 8px',
                backgroundColor: '#27272a',
                color: '#ffffff',
                border: '1px solid #3f3f46',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
            >
              {audioDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  🎙️ {device.label || `Mic ${index + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div style={{
        position: 'relative',
        width: '90%',
        height: 'calc(100% - 6rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxHeight: '100%',
          aspectRatio: getCanvasAspectRatio(),
          borderRadius: '12px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />

          {/* Recording Overlay Tag */}
          {isRecording && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid #ef4444',
              padding: '6px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              color: '#ef4444',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'inline-block'
              }} />
              REC {formatTime(recordingSeconds)} 🎙️
            </div>
          )}

          {/* Lock Buttons Out of Frame */}
          <button
            onClick={() => setLockLeftPan((prev) => !prev)}
            style={{
              position: 'absolute',
              bottom: '-42px',
              left: '0px',
              zIndex: 10,
              padding: '6px 12px',
              backgroundColor: lockLeftPan ? '#ef4444' : '#18181b',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {lockLeftPan ? '🔒 Left Locked' : '🎯 Lock Left'}
          </button>

          <button
            onClick={() => setLockRightPan((prev) => !prev)}
            style={{
              position: 'absolute',
              bottom: '-42px',
              right: '0px',
              zIndex: 10,
              padding: '6px 12px',
              backgroundColor: lockRightPan ? '#ef4444' : '#18181b',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {lockRightPan ? '🔒 Right Locked' : '🎯 Lock Right'}
          </button>

          {/* Tuner HUD */}
          {showTuner && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 12,
              backgroundColor: 'rgba(15, 15, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '180px'
            }}>
              <span style={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Guitar Tuner
              </span>
              {tunerData ? (
                <>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: Math.abs(tunerData.cents) <= 5 ? '#22c55e' : '#f59e0b' }}>
                    {tunerData.note}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                    {tunerData.frequency} Hz
                  </div>
                </>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#71717a' }}>Pluck a string...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}