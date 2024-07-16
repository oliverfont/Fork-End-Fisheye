// media.js
import { openLightbox } from './lightbox.js';

export class Media {
    constructor(file, likes, thumbnail, title, date) {
        this.file = file;
        this.likes = likes;
        this.thumbnail = thumbnail;
        this.title = title;
        this.date = date;
    }

    async createClickableImageElement(images) {
        const linkElement = document.createElement('a');
        linkElement.href = this.file;
        linkElement.tabIndex = 0;
        linkElement.setAttribute('title', `Voir le média: ${this.title}`);

        if (this.isVideo()) {
            const thumbnailSrc = await this.createVideoThumbnail();
            const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
            linkElement.appendChild(thumbnailImageElement);
            linkElement.setAttribute('aria-label', `Video: ${this.title}`);
        } else {
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
            linkElement.setAttribute('aria-label', `Image: ${this.title}`);
        }

        linkElement.addEventListener('focus', () => showTooltip(linkElement));

        linkElement.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (this.isVideo()) {
                    openLightbox(this.file, images, true);
                } else {
                    openLightbox(this.file, images);
                }
            }
        });

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
        imageElement.alt = this.title;
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

export class MediaFactory {
    createMedia(file, likes, thumbnail, title, date) {
        return new Media(file, likes, thumbnail, title, date);
    }
}

// Fonction pour afficher l'infobulle
function showTooltip(element) {
    const tooltipText = element.getAttribute('title');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = tooltipText;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;

    element.addEventListener('blur', () => {
        document.body.removeChild(tooltip);
    }, { once: true });
}
