// Media.js
export default class Media {
    constructor(file, likes, thumbnail, title, date) {
        this.file = file;
        this.likes = likes;
        this.thumbnail = thumbnail;
        this.title = title;
        this.date = date;
    }

    async createClickableImageElement() {
        const linkElement = document.createElement('a');
        linkElement.href = this.file;

        if (this.isVideo()) {
            // Si c'est une vidéo, créez une miniature pour la galerie
            const thumbnailSrc = await this.createVideoThumbnail();
            const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
            linkElement.appendChild(thumbnailImageElement);
        } else {
            // Si ce n'est pas une vidéo, créez un élément image normal pour la galerie
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
        }

        return linkElement;
    }

    createVideoElement() {
        const videoElement = document.createElement('video');
        videoElement.classList.add('gallery-media', 'gallery-img');
        videoElement.controls = true;

        const sourceElement = document.createElement('source');
        sourceElement.src = this.file;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);

        return videoElement;
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

    async captureVideoThumbnail(videoElement) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
    }

    createImageElement() {
        const imageElement = new Image();
        imageElement.classList.add('gallery-media', 'gallery-img');
        imageElement.src = this.file;
        return imageElement;
    }

    createThumbnailImageElement(thumbnailSrc) {
        const thumbnailImage = this.createImageElement();
        thumbnailImage.src = thumbnailSrc;
        return thumbnailImage;
    }

    isVideo() {
        return this.file.toLowerCase().endsWith('.mp4');
    }
}
