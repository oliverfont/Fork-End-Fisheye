class Media {
    constructor(file) {
        this.file = file;
    }

    createClickableImageElement() {
        const linkElement = document.createElement('a');
        linkElement.href = this.file;

        if (this.isVideo()) {
            this.createVideoThumbnail().then(thumbnailSrc => {
                const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
                linkElement.appendChild(thumbnailImageElement);
            });
        } else {
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
        }

        return linkElement;
    }

    async createVideoThumbnail() {
        return new Promise((resolve, reject) => {
            const videoElement = document.createElement('video');
            videoElement.src = this.file;
            videoElement.onloadeddata = async () => {
                try {
                    const thumbnail = await this.captureVideoThumbnail(videoElement);
                    resolve(thumbnail);
                } catch (error) {
                    reject(error);
                }
            };
            videoElement.load();
        });
    }

    captureVideoThumbnail(videoElement) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const thumbnailDataUrl = canvas.toDataURL();
            resolve(thumbnailDataUrl);
        });
    }

    createVideoElement() {
        const videoElement = document.createElement('video');
        videoElement.classList.add('gallery-media');
        videoElement.controls = true;

        const sourceElement = document.createElement('source');
        sourceElement.src = this.file;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);

        videoElement.addEventListener('loadeddata', async () => {
            const thumbnail = await this.createVideoThumbnail(videoElement);
            const thumbnailImageElement = this.createThumbnailImageElement(thumbnail);
            galerie.appendChild(thumbnailImageElement);
        });

        return videoElement;
    }

    createThumbnailImageElement(thumbnailSrc) {
        const thumbnailImage = this.createImageElement();
        thumbnailImage.src = thumbnailSrc;
        return thumbnailImage;
    }

    createImageElement() {
        const imageElement = new Image();
        imageElement.classList.add('gallery-media', 'gallery-img');
        imageElement.src = this.file;
        return imageElement;
    }

    isVideo() {
        return this.file.toLowerCase().endsWith('.mp4');
    }
}