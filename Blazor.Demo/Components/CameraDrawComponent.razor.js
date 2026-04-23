export class CameraDrawComponent {

    constructor(video, canvas) {
        this.video = video;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        // Drawing state
        this.isDrawing = false;
        this.penColor = "#000000";
        this.penThickness = 1;

        // Bind event handlers
        this.startDrawHandler = event => this.startDraw(event);
        this.drawHandler = event => this.draw(event);
        this.endDrawHandler = () => this.endDraw();

        this.bindCanvasEvents();
    }

    async startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.video.srcObject = stream;
        await this.video.play();
    }

    stopCamera() {
        const stream = this.video.srcObject;

        if (stream && stream.getTracks) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        this.video.srcObject = null;
    }

    takePhoto() {
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    }


    startDraw(event) {
        this.isDrawing = true;
        const position = this.getPosition(event);
        this.context.beginPath();
        this.context.moveTo(position.x, position.y);
    }

    draw(event) {
        if (!this.isDrawing) {
            return;
        }

        event.preventDefault();

        const position = this.getPosition(event);
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = this.penThickness;
        this.context.globalCompositeOperation = "source-over";
        this.context.strokeStyle = this.penColor;

        this.context.lineTo(position.x, position.y);
        this.context.stroke();
    }

    endDraw() {
        this.isDrawing = false;
        this.context.closePath();
    }

    getPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const source = event.touches && event.touches.length > 0 ? event.touches[0] : event;

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (source.clientX - rect.left) * scaleX,
            y: (source.clientY - rect.top) * scaleY
        };
    }

    setPenColor(color) {
        this.penColor = color;
    }

    setPenThickness(thickness) {
        this.penThickness = thickness;
    }

    bindCanvasEvents() {
        this.canvas.addEventListener("mousedown", this.startDrawHandler);
        this.canvas.addEventListener("mousemove", this.drawHandler);
        this.canvas.addEventListener("mouseup", this.endDrawHandler);
        this.canvas.addEventListener("mouseleave", this.endDrawHandler);

        this.canvas.addEventListener("touchstart", this.startDrawHandler, { passive: false });
        this.canvas.addEventListener("touchmove", this.drawHandler, { passive: false });
        this.canvas.addEventListener("touchend", this.endDrawHandler);
        this.canvas.addEventListener("touchcancel", this.endDrawHandler);
    }

    unbindCanvasEvents() {
        this.canvas.removeEventListener("mousedown", this.startDrawHandler);
        this.canvas.removeEventListener("mousemove", this.drawHandler);
        this.canvas.removeEventListener("mouseup", this.endDrawHandler);
        this.canvas.removeEventListener("mouseleave", this.endDrawHandler);

        this.canvas.removeEventListener("touchstart", this.startDrawHandler);
        this.canvas.removeEventListener("touchmove", this.drawHandler);
        this.canvas.removeEventListener("touchend", this.endDrawHandler);
        this.canvas.removeEventListener("touchcancel", this.endDrawHandler);
    }
  

    dispose() {
        this.stopCamera();
        // Clear canvas and history
        this.unbindCanvasEvents();
    }
}