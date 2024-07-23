// Déclaration des variables globales pour suivre l'état de la lightbox, les images et l'index du média actuel
let lightboxIsOpen = false;
let images = [];
let currentMediaIndex = 0;

// Fonction pour ouvrir la lightbox avec un média donné (image ou vidéo)
export function openLightbox(mediaUrl, mediaList, isVideo = false) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxMedia = document.getElementById('lightboxContent');

    if (!lightboxMedia) {
        console.error("L'élément lightboxMedia n'a pas été trouvé.");
        return;
    }

    // Mise à jour des images et de l'index du média actuel
    images = mediaList || [];
    currentMediaIndex = images.findIndex(media => media.src === mediaUrl);

    if (currentMediaIndex === -1) {
        console.error("Index de média introuvable. Utilisation du premier média.");
        currentMediaIndex = 0;
    }

    // Réinitialiser le contenu de la lightbox
    lightboxMedia.innerHTML = '';

    // Ajoute le média (image ou vidéo) à la lightbox
    if (isVideo) {
        const videoElement = createVideoElement(mediaUrl);
        lightboxMedia.appendChild(videoElement);
    } else {
        const imageElement = createImageElement(mediaUrl);
        lightboxMedia.appendChild(imageElement);

        // Ajoute le titre sous l'image
        const titleElement = document.createElement('p');
        titleElement.classList.add('lightbox-title');
        titleElement.innerText = images[currentMediaIndex].title;
        lightboxMedia.appendChild(titleElement);
    }

    // Affiche la lightbox
    lightbox.style.display = 'flex';
    lightboxIsOpen = true;

    // Gérer les boutons de navigation et de fermeture
    const nextBtn = document.querySelector('.next');
    nextBtn.tabIndex = 0;
    document.querySelector('.next').focus();
    const prevBtn = document.querySelector('.prev');
    prevBtn.tabIndex = 0;
    const closeBtn = document.querySelector('.close');
    closeBtn.tabIndex = 0;
    closeBtn.addEventListener('click', closeLightbox);
    closeBtn.setAttribute('role', 'button');
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            closeLightbox();
        }
    });

    // Ferme la lightbox si l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Déplace le focus vers la lightbox pour une meilleure navigation au clavier
    lightbox.focus();
}

// Fonction pour fermer la lightbox
export function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    lightbox.style.display = 'none';
    lightboxIsOpen = false;
}

// Fonction pour naviguer entre les médias dans la lightbox
export function navigateLightbox(direction) {
    currentMediaIndex = (currentMediaIndex + direction + images.length) % images.length;

    if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
        const newMedia = images[currentMediaIndex];
        const newMediaUrl = newMedia.src;
        const newMediaIsVideo = newMedia.isVideo;

        openLightbox(newMediaUrl, images, newMediaIsVideo);
    }
}

// Fonction pour créer un élément image
function createImageElement(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.classList.add('lightbox-media');
    imageElement.src = imageUrl;
    imageElement.alt = 'Image in lightbox';
    return imageElement;
}

// Fonction pour créer un élément vidéo
function createVideoElement(videoUrl) {
    const videoElement = document.createElement('video');
    videoElement.classList.add('lightbox-media');
    videoElement.controls = true;
    videoElement.autoplay = true;

    const sourceElement = document.createElement('source');
    sourceElement.src = videoUrl;
    sourceElement.type = 'video/mp4';

    videoElement.appendChild(sourceElement);

    return videoElement;
}

// Écouteur d'événements pour les touches du clavier
document.addEventListener('keydown', (event) => {
    if (lightboxIsOpen) {
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (event.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
    }
});

// Écouteurs d'événements pour les boutons de navigation
document.querySelector('.next').addEventListener('click', () => {
    navigateLightbox(1);
});

document.querySelector('.prev').addEventListener('click', () => {
    navigateLightbox(-1);
});
