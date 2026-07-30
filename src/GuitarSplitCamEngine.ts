// Access MediaPipe directly from the global window object loaded via index.html
const Hands = (window as any).Hands;
const Camera = (window as any).Camera;

export class GuitarSplitCamEngine {
  private videoElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hands: any;
  private camera: any = null;

  public zoomLevel: number = 50;

  private smoothLeftCenter = { x: 200, y: 360 };
  private smoothRightCenter = { x: 960, y: 360 };

  constructor(videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) {
    this.videoElement = videoEl;
    this.canvasElement = canvasEl;
    this.ctx = canvasEl.getContext('2d')!;

    this.hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.3,
      minTrackingConfidence: 0.3,
    });

    this.hands.onResults((results: any) => this.processFrame(results));
  }

  public start() {
    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await this.hands.send({ image: this.videoElement });
      },
      width: 1280,
      height: 720,
    });
    this.camera.start();
  }

  public stop() {
    if (this.camera) {
      this.camera.stop();
    }
  }

  private calculateFretAnchor(landmarks: any[], width: number, height: number) {
    const wrist = landmarks[0];
    const indexTip = landmarks[8];

    let cx = (wrist.x * 0.3 + indexTip.x * 0.7) * width;
    let cy = (wrist.y * 0.3 + indexTip.y * 0.7) * height;

    cx = Math.max(10, Math.min(width - 10, cx));
    cy = Math.max(10, Math.min(height - 10, cy));

    return { x: cx, y: cy };
  }

  private processFrame(results: any) {
    const imgWidth = results.image.width;
    const imgHeight = results.image.height;
    const padding = Math.max(30, 220 - this.zoomLevel * 1.8);

    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
        const label = results.multiHandedness[index].label;
        const target = this.calculateFretAnchor(landmarks, imgWidth, imgHeight);

        // Determine current center reference
        const currentCenter = label === 'Left' ? this.smoothLeftCenter : this.smoothRightCenter;

        // Calculate hand movement speed
        const dx = target.x - currentCenter.x;
        const dy = target.y - currentCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Dynamic smoothing factor scaling with motion speed
        const dynamicFactor = Math.min(0.45, Math.max(0.08, distance / 150));

        // Apply dynamic interpolation
        if (label === 'Left') {
          this.smoothLeftCenter.x += dx * dynamicFactor;
          this.smoothLeftCenter.y += dy * dynamicFactor;
        } else {
          this.smoothRightCenter.x += dx * dynamicFactor;
          this.smoothRightCenter.y += dy * dynamicFactor;
        }
      });
    }

    this.renderSplitView(results.image, padding);
  }

  private renderSplitView(image: any, padding: number) {
    // Read the rendered CSS dimensions dynamically instead of hardcoding dimensions
    const cssWidth = this.canvasElement.clientWidth || 800;
    const cssHeight = this.canvasElement.clientHeight || (cssWidth / 2); // Maintain 2:1 aspect ratio
    const dpr = window.devicePixelRatio || 1;

    // Set internal buffer size scaled by display pixel ratio
    this.canvasElement.width = cssWidth * dpr;
    this.canvasElement.height = cssHeight * dpr;

    const panelWidth = cssWidth / 2;
    const panelHeight = cssHeight;

    const drawCrop = (center: { x: number; y: number }, dx: number) => {
      const minX = Math.max(0, center.x - padding);
      const minY = Math.max(0, center.y - padding);
      const cropSize = padding * 2;

      this.ctx.drawImage(
        image,
        minX, minY, cropSize, cropSize,
        dx * dpr, 0, panelWidth * dpr, panelHeight * dpr
      );
    };

    this.ctx.save();
    // Mirror global canvas taking devicePixelRatio into account
    this.ctx.translate(this.canvasElement.width, 0);
    this.ctx.scale(-1, 1);

    // Swap sides to maintain proper orientation after mirror transform
    drawCrop(this.smoothLeftCenter, 0);
    drawCrop(this.smoothRightCenter, panelWidth);

    this.ctx.restore();

    // Scale drawing context for crisp overlays
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    // Center Divider Line
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(panelWidth, 0);
    this.ctx.lineTo(panelWidth, panelHeight);
    this.ctx.stroke();

    // Text Overlay - Scale font size proportionally for smaller screens
    const fontSize = Math.max(12, Math.min(16, cssWidth / 50));
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = `bold ${fontSize}px sans-serif`;
    this.ctx.fillText('FRET HAND', 15, fontSize + 15);
    this.ctx.fillText('STRUM HAND', panelWidth + 15, fontSize + 15);

    this.ctx.restore();
  }
}