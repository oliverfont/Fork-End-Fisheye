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
            // Si c'est une vidéo, créez un élément vidéo pour la galerie
            const videoElement = this.createVideoElement();
            linkElement.appendChild(videoElement);
            linkElement.setAttribute('aria-label', `Video: ${this.title}`);
        } else {
            // Si ce n'est pas une vidéo, créez un élément image pour la galerie
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
            linkElement.setAttribute('aria-label', `Image: ${this.title}`);
        }

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

        // Ajout d'infobulle
        linkElement.addEventListener('focus', () => showTooltip(linkElement));

        return linkElement;
    }

    createVideoElement() {
        const videoElement = document.createElement('video');
        videoElement.classList.add('gallery-media', 'gallery-img');
        videoElement.controls = true;
        videoElement.src = this.file;
        videoElement.alt = this.title;
        return videoElement;
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

export class MediaFactory {
    createMedia(file, likes, thumbnail, title, date) {
        return new Media(file, likes, thumbnail, title, date);
    }
}
