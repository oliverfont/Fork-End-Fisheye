let lightboxIsOpen = false;
let images = [];

function openLightbox(mediaUrl, mediaList, isVideo = false, thumbnailSrc = '') {
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
    } else {
        // Supprimez l'élément existant de la lightbox
        lightboxMedia.innerHTML = '';

        if (isVideo) {
            // Si c'est une vidéo, créez un lecteur vidéo directement dans la lightbox
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');

            const videoElement = document.createElement('video');
            videoElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = mediaUrl;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);

            videoContainer.appendChild(videoElement);
            lightboxMedia.appendChild(videoContainer);
        } else {
            // Si c'est une image, créez un élément image
            const imageElement = document.createElement('img');
            imageElement.src = mediaUrl;
            imageElement.id = 'lightboxImg'; // Ajout de l'id "lightboxImg"
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

    const sourceElement = document.createElement('source');
    sourceElement.src = videoUrl;
    sourceElement.type = 'video/mp4';

    videoElement.appendChild(sourceElement);

    return videoElement;
}

function navigateLightbox(direction) {
    currentMediaIndex = (currentMediaIndex + direction + images.length) % images.length;

    if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
        const newMediaUrl = images[currentMediaIndex].src;
        const newMediaIsVideo = images[currentMediaIndex].isVideo;

        // Vérifiez si le nouveau média est une vidéo ou une image, puis ouvrez la lightbox en conséquence
        openLightbox(newMediaUrl, images, newMediaIsVideo);
    }
}


function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    lightbox.style.display = 'none';
    lightboxIsOpen = false;
}

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
