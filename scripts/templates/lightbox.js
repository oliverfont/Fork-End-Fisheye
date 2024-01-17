let lightboxIsOpen = false;
let currentMediaIndex = 0;
let images = [];

function openLightbox(mediaUrl, mediaList) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxMedia = document.getElementById('lightboxContent');

    if (!lightboxMedia) {
        console.error("L'élément lightboxMedia n'a pas été trouvé.");
        return;
    }

    images = mediaList || [];
    currentMediaIndex = images.findIndex(media => media.src === mediaUrl);

    if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
        const currentMedia = images[currentMediaIndex];

        lightboxMedia.innerHTML = ''; // Nettoyez le contenu précédent de la lightbox

        if (currentMedia.isVideo) {
            const videoElement = document.createElement('video');
            videoElement.src = currentMedia.src;
            videoElement.controls = true;
            videoElement.autoplay = true;

            lightboxMedia.appendChild(videoElement);
        } else {
            const imageElement = document.createElement('img');
            imageElement.src = currentMedia.src;
            imageElement.id = 'lightboxImg'; // Ajout de l'id "lightboxImg"
            lightboxMedia.appendChild(imageElement);

            // Ajout du titre sous l'image
            const titleElement = document.createElement('p');
            titleElement.classList.add('lightbox-title');
            titleElement.innerText = currentMedia.title;
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
    } else {
        console.error("Index de média actuel hors limites.");
    }
}


function navigateLightbox(direction) {
    const newIndex = (currentMediaIndex + direction + images.length) % images.length;

    if (newIndex >= 0 && newIndex < images.length) {
        const newMediaUrl = images[newIndex].src;
        openLightbox(newMediaUrl, images);
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
