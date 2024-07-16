// Importation de la fonction openLightbox depuis lightbox.js
import { openLightbox } from './lightbox.js';

// Déclaration de la classe Media pour gérer les médias (images et vidéos)
export class Media {
    constructor(file, likes, thumbnail, title, date) {
        this.file = file; // Chemin du fichier média
        this.likes = likes; // Nombre de likes
        this.thumbnail = thumbnail; // Chemin de la miniature
        this.title = title; // Titre du média
        this.date = date; // Date du média
    }

    // Fonction asynchrone pour créer un élément cliquable d'image ou de vidéo
    async createClickableImageElement(images) {
        const linkElement = document.createElement('a');
        linkElement.href = this.file;
        linkElement.tabIndex = 0;
        linkElement.setAttribute('title', `Voir le média: ${this.title}`);

        // Vérifier si le fichier est une vidéo ou une image
        if (this.isVideo()) {
            // Si c'est une vidéo, créez un élément vidéo pour la galerie
            const videoElement = this.createVideoElement();
            linkElement.tabIndex = -1;
            linkElement.appendChild(videoElement);
            linkElement.setAttribute('aria-label', `Video: ${this.title}`);

            // Créez un élément cliquable invisible par-dessus la vidéo
            const overlayElement = document.createElement('div');
            overlayElement.style.position = 'absolute';
            overlayElement.style.top = 0;
            overlayElement.style.left = 0;
            overlayElement.style.width = '100%';
            overlayElement.style.height = '100%';
            overlayElement.style.cursor = 'pointer';
            overlayElement.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Transparent

            // Ajoutez un écouteur d'événement pour ouvrir la lightbox au clic
            overlayElement.addEventListener('click', (event) => {
                event.preventDefault();
                openLightbox(this.file, images, true);
            });

            linkElement.style.position = 'relative'; // Position relative pour que l'overlay fonctionne correctement
            linkElement.appendChild(overlayElement);
        } else {
            // Si ce n'est pas une vidéo, créez un élément image pour la galerie
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
            linkElement.setAttribute('aria-label', `Image: ${this.title}`);
        }

        // Écouteur d'événement pour ouvrir la lightbox avec la touche Entrée ou Espace
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

        // Ajouter une infobulle lorsque l'élément est mis au focus
        linkElement.addEventListener('focus', () => showTooltip(linkElement));

        return linkElement;
    }

    // Fonction pour créer un élément vidéo
    createVideoElement() {
        const videoElement = document.createElement('video');
        videoElement.classList.add('gallery-media', 'gallery-img');
        videoElement.controls = true;
        videoElement.src = this.file; // Source de la vidéo
        videoElement.alt = this.title; // Texte alternatif pour la vidéo
        return videoElement;
    }
    
    // Fonction pour créer un élément image
    createImageElement() {
        const imageElement = new Image();
        imageElement.classList.add('gallery-media', 'gallery-img');
        imageElement.src = this.file; // Source de l'image
        imageElement.alt = this.title; // Texte alternatif pour l'image
        return imageElement;
    }

    // Fonction pour créer un élément image miniature
    createThumbnailImageElement(thumbnailSrc) {
        const thumbnailImage = this.createImageElement();
        thumbnailImage.src = thumbnailSrc; // Source de la miniature
        return thumbnailImage;
    }

    // Vérifie si le fichier est une vidéo
    isVideo() {
        return this.file.toLowerCase().endsWith('.mp4');
    }
}

// Fonction pour afficher une infobulle
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

// Déclaration de la classe MediaFactory pour créer des objets Media
export class MediaFactory {
    createMedia(file, likes, thumbnail, title, date) {
        return new Media(file, likes, thumbnail, title, date);
    }
}
