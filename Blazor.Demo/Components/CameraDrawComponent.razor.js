export class CameraDrawComponent {

    constructor(video, canvas) {
        this.video = video;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
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


    dispose() {
        this.stopCamera();
    }
}