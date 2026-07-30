import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Hands: any;
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
  if (rms < 0.015) return -1; // Volume threshold

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

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraInstanceRef = useRef<any>(null);

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
  const leftPanRef = useRef<{ x: number; y: number }>({ x: 0.35, y: 0.5 });
  const rightPanRef = useRef<{ x: number; y: number }>({ x: 0.65, y: 0.5 });

  // Independent Tracking Lock States
  const [lockLeftPan, setLockLeftPan] = useState(false);
  const [lockRightPan, setLockRightPan] = useState(false);

  const lockLeftPanRef = useRef(lockLeftPan);
  const lockRightPanRef = useRef(lockRightPan);

  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const zoomLevelRef = useRef(zoomLevel);

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

  // Main Hand Tracking & Camera Stream Loop
  useEffect(() => {
    let isActive = true;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement || !window.Hands || !window.Camera) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    if (cameraInstanceRef.current) {
      cameraInstanceRef.current.stop();
    }

    const onResults = (results: any) => {
      if (!isActive) return;

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

      const splitWidth = displayWidth / 2;
      const zoom = zoomLevelRef.current;

      canvasCtx.fillStyle = '#18181b';
      canvasCtx.fillRect(0, 0, splitWidth, displayHeight);
      canvasCtx.fillRect(splitWidth, 0, splitWidth, displayHeight);

      if (results.image) {
        const imgWidth = results.image.width;
        const imgHeight = results.image.height;

        let leftTarget = { ...leftPanRef.current };
        let rightTarget = { ...rightPanRef.current };

        if (results.multiHandLandmarks && results.multiHandedness) {
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
        }

        const lerpFactor = 0.1;
        if (!lockLeftPanRef.current) {
          leftPanRef.current.x += (leftTarget.x - leftPanRef.current.x) * lerpFactor;
          leftPanRef.current.y += (leftTarget.y - leftPanRef.current.y) * lerpFactor;
        }

        if (!lockRightPanRef.current) {
          rightPanRef.current.x += (rightTarget.x - rightPanRef.current.x) * lerpFactor;
          rightPanRef.current.y += (rightTarget.y - rightPanRef.current.y) * lerpFactor;
        }

        const splitAspect = splitWidth / displayHeight;
        const imgAspect = imgWidth / imgHeight;

        let renderW = imgWidth;
        let renderH = imgHeight;

        if (imgAspect > splitAspect) {
          renderW = imgHeight * splitAspect;
        } else {
          renderH = imgWidth / splitAspect;
        }

        renderW = renderW / zoom;
        renderH = renderH / zoom;

        const drawMirroredView = (xOffset: number, panX: number, panY: number) => {
          let sx = panX * imgWidth - renderW / 2;
          let sy = panY * imgHeight - renderH / 2;

          sx = Math.max(0, Math.min(imgWidth - renderW, sx));
          sy = Math.max(0, Math.min(imgHeight - renderH, sy));

          canvasCtx.save();
          canvasCtx.beginPath();
          canvasCtx.rect(xOffset, 0, splitWidth, displayHeight);
          canvasCtx.clip();

          canvasCtx.translate(xOffset + splitWidth, 0);
          canvasCtx.scale(-1, 1);

          canvasCtx.drawImage(
            results.image,
            sx, sy, renderW, renderH,
            0, 0, splitWidth, displayHeight
          );

          canvasCtx.restore();
        };

        drawMirroredView(0, leftPanRef.current.x, leftPanRef.current.y);
        drawMirroredView(splitWidth, rightPanRef.current.x, rightPanRef.current.y);
      }

      // Center Divider Line
      canvasCtx.strokeStyle = '#3f3f46';
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      canvasCtx.moveTo(splitWidth, 0);
      canvasCtx.lineTo(splitWidth, displayHeight);
      canvasCtx.stroke();

      canvasCtx.restore();
    };

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

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
        if (isActive && selectedDeviceId) {
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (!isActive) {
              fallbackStream.getTracks().forEach((t) => t.stop());
              return;
            }
            videoElement.srcObject = fallbackStream;
            await refreshDevices();
            await videoElement.play();
            if (isActive) camera.start();
          } catch (fbErr) {
            console.error('Fallback video stream failed:', fbErr);
          }
        }
      }
    };

    startStream(primaryConstraints);

    return () => {
      isActive = false;
      camera.stop();
      hands.close();
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId]);

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
        const canvasStream = canvasElement.captureStream(60);
        let combinedStream = canvasStream;

        const audioConstraints: MediaTrackConstraints | boolean = selectedAudioId
          ? { deviceId: { exact: selectedAudioId } }
          : true;

        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
          audioStreamRef.current = micStream;

          combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...micStream.getAudioTracks()
          ]);
        } catch (audioErr) {
          console.warn('Selected mic access failed, falling back to default mic:', audioErr);
          try {
            const fallbackMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = fallbackMicStream;

            combinedStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              ...fallbackMicStream.getAudioTracks()
            ]);
          } catch (fallbackErr) {
            console.error('All audio input requests failed. Recording video only:', fallbackErr);
          }
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

  return (
    <div style={{
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      backgroundColor: '#0f0f11',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      color: '#fff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h1 style={{ 
        marginBottom: '0.4rem', 
        fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)', 
        fontWeight: 'bold',
        textAlign: 'center' 
      }}>
        Guitar Split-Cam
      </h1>

      {/* Scaled Main Canvas Container */}
      <div style={{
        position: 'relative',
        width: '95%',
        maxWidth: '1100px',
        maxHeight: 'calc(100vh - 3.8rem)',
        aspectRatio: '2/1',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />

        {/* Live Recording HUD */}
        {isRecording && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            padding: '4px 10px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            color: '#ef4444',
            fontWeight: 'bold',
            fontSize: 'clamp(0.65rem, 1vw, 0.8rem)'
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

        {/* Dynamic Guitar Tuner Overlay HUD */}
        {showTuner && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 12,
            backgroundColor: 'rgba(15, 15, 20, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '8px 16px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '180px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <span style={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Guitar Tuner
            </span>
            
            {tunerData ? (
              <>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  margin: '2px 0',
                  color: Math.abs(tunerData.cents) <= 5 ? '#22c55e' : '#f59e0b'
                }}>
                  {tunerData.note}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginBottom: '4px' }}>
                  {tunerData.frequency} Hz
                </div>

                {/* Cents Meter Needle */}
                <div style={{ position: 'relative', width: '120px', height: '5px', backgroundColor: '#27272a', borderRadius: '3px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    width: '2px',
                    height: '100%',
                    backgroundColor: '#22c55e'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    left: `${50 + (tunerData.cents / 50) * 45}%`,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: Math.abs(tunerData.cents) <= 5 ? '#22c55e' : '#ef4444',
                    transform: 'translateX(-50%)',
                    transition: 'left 0.1s ease, background-color 0.1s ease'
                  }} />
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#71717a', margin: '8px 0' }}>
                Pluck a string...
              </span>
            )}
          </div>
        )}

        {/* Left Lock Button */}
        <button
          onClick={() => setLockLeftPan((prev) => !prev)}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 10,
            padding: '5px 8px',
            backgroundColor: lockLeftPan ? '#ef4444' : 'rgba(31, 41, 55, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
        >
          {lockLeftPan ? '🔒 Left Locked' : '🎯 Lock Left'}
        </button>

        {/* Right Lock Button */}
        <button
          onClick={() => setLockRightPan((prev) => !prev)}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 10,
            padding: '5px 8px',
            backgroundColor: lockRightPan ? '#ef4444' : 'rgba(31, 41, 55, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
        >
          {lockRightPan ? '🔒 Right Locked' : '🎯 Lock Right'}
        </button>

        {/* Compact Top Controls Overlay Bar */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: '6px',
          zIndex: 10,
          backgroundColor: 'rgba(15, 15, 17, 0.85)',
          padding: '4px 8px',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 'calc(100% - 20px)'
        }}>
          {/* Tuner Toggle */}
          <button
            onClick={() => setShowTuner((prev) => !prev)}
            style={{
              padding: '5px 8px',
              backgroundColor: showTuner ? '#2563eb' : 'rgba(31, 41, 55, 0.85)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            🎸 Tuner
          </button>

          {/* Record Button */}
          <button
            onClick={toggleRecording}
            style={{
              padding: '5px 8px',
              backgroundColor: isRecording ? '#dc2626' : '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {isRecording ? '⏹ Stop' : '⏺ Record'}
          </button>

          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)' }}>
            <span style={{ fontWeight: 'bold' }}>🔍</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              style={{ cursor: 'pointer', width: '60px' }}
            />
            <span style={{ minWidth: '24px', fontSize: '0.7rem', color: '#a1a1aa' }}>
              {zoomLevel.toFixed(1)}x
            </span>
          </div>

          {/* Camera Dropdown */}
          {videoDevices.length > 0 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              style={{
                padding: '4px 6px',
                backgroundColor: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none',
                fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
                maxWidth: '110px',
                textOverflow: 'ellipsis'
              }}
            >
              {videoDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  📷 {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          )}

          {/* Microphone Dropdown */}
          {audioDevices.length > 0 && (
            <select
              value={selectedAudioId}
              onChange={(e) => setSelectedAudioId(e.target.value)}
              disabled={isRecording}
              style={{
                padding: '4px 6px',
                backgroundColor: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isRecording ? 'not-allowed' : 'pointer',
                outline: 'none',
                fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
                maxWidth: '110px',
                textOverflow: 'ellipsis',
                opacity: isRecording ? 0.6 : 1
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
    </div>
  );
}