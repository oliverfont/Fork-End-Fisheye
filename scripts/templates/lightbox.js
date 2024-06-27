let lightboxIsOpen = false;
let images = [];
let currentMediaIndex = 0; // Déclarez currentMediaIndex en dehors de toute fonction

function openLightbox(mediaUrl, mediaList, isVideo = false) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxMedia = document.getElementById('lightboxContent');

    if (!lightboxMedia) {
        console.error("L'élément lightboxMedia n'a pas été trouvé.");
        return;
    }

    images = mediaList || [];
    currentMediaIndex = images.findIndex(media => media.src === mediaUrl);

    if (currentMediaIndex === -1) {
        console.error("Index de média introuvable. Utilisation du premier média.");
        currentMediaIndex = 0;
    }

    // Supprimez l'élément existant de la lightbox
    lightboxMedia.innerHTML = '';

    if (isVideo) {
        // Si c'est une vidéo, créez un lecteur vidéo directement dans la lightbox
        const videoElement = createVideoElement(mediaUrl);
        lightboxMedia.appendChild(videoElement);
    } else {
        // Si c'est une image, créez un élément image
        const imageElement = createImageElement(mediaUrl);
        lightboxMedia.appendChild(imageElement);

        // Ajout du titre sous l'image
        const titleElement = document.createElement('p');
        titleElement.classList.add('lightbox-title');
        titleElement.innerText = images[currentMediaIndex].title;
        lightboxMedia.appendChild(titleElement);
    }

    lightbox.style.display = 'flex';
    lightboxIsOpen = true;

    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeLightbox);

    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

// Ajout des fonctions de création d'éléments
function createImageElement(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.classList.add('lightbox-media');
    imageElement.src = imageUrl;
    return imageElement;
}

function createVideoElement(videoUrl) {
    const videoElement = document.createElement('video');
    videoElement.classList.add('lightbox-media');
    videoElement.controls = true;
    videoElement.autoplay = true; // Autoplay pour que la vidéo démarre immédiatement

    const sourceElement = document.createElement('source');
    sourceElement.src = videoUrl;
    sourceElement.type = 'video/mp4';

    videoElement.appendChild(sourceElement);

    return videoElement;
}

function navigateLightbox(direction) {
    currentMediaIndex = (currentMediaIndex + direction + images.length) % images.length;

    if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
        const newMedia = images[currentMediaIndex];
        const newMediaUrl = newMedia.src;
        const newMediaIsVideo = newMedia.isVideo;

        // Vérifiez si le nouveau média est une vidéo ou une image, puis ouvrez la lightbox en conséquence
        openLightbox(newMediaUrl, images, newMediaIsVideo);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    lightbox.style.display = 'none';
    lightboxIsOpen = false;
}

// Écouteur d'événements pour les touches du clavier
window.addEventListener('keydown', (event) => {
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

// Ajout d'écouteurs d'événements pour les boutons next et prev
document.querySelector('.next').addEventListener('click', () => {
    navigateLightbox(1);
});

document.querySelector('.prev').addEventListener('click', () => {
    navigateLightbox(-1);
});
