let lightboxIsOpen = false;
let currentImageIndex = 0;
let images = [];

function openLightbox(mediaUrl, mediaList) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxMedia = document.getElementById('lightboxContent');

    if (!lightboxMedia) {
        console.error("L'élément lightboxMedia n'a pas été trouvé.");
        return;
    }

    images = mediaList || [];
    currentImageIndex = images.findIndex(media => media.src === mediaUrl);

    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        const currentMedia = images[currentImageIndex];

        lightboxMedia.innerHTML = ''; // Nettoyez le contenu précédent de la lightbox

        if (currentMedia.isVideo) {
            const videoElement = document.createElement('video');
            videoElement.id = 'lightboxVid'; // Ajout de l'id lightboxVid
            videoElement.src = currentMedia.src;
            videoElement.controls = true;
            videoElement.autoplay = true; // Ajout de l'attribut autoplay pour lancer automatiquement la vidéo
            lightboxMedia.appendChild(videoElement);
        } else {
            const imageElement = document.createElement('img');
            imageElement.id = 'lightboxImg'; // Ajout de l'id lightboxImg
            imageElement.src = currentMedia.src;
            lightboxMedia.appendChild(imageElement);
        }

        lightbox.style.display = 'flex';
        lightboxIsOpen = true;

        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', function () {
            lightbox.style.display = 'none';
            lightboxIsOpen = false;
        });

        window.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
                lightboxIsOpen = false;
            }
        });

        const nextBtn = document.querySelector('.next');
        nextBtn.addEventListener('click', function () {
            navigateLightbox(1);
        });

        const prevBtn = document.querySelector('.prev');
        prevBtn.addEventListener('click', function () {
            navigateLightbox(-1);
        });
    } else {
        console.error("Index de média actuel hors limites.");
    }
}

function navigateLightbox(direction) {
    const newIndex = currentImageIndex + direction;

    if (newIndex >= 0 && newIndex < images.length) {
        openLightbox(images[newIndex].src, images);
        currentImageIndex = newIndex;
    } else if (newIndex >= images.length) {
        // Si l'index dépasse la fin du tableau, revenir au début
        openLightbox(images[0].src, images);
        currentImageIndex = 0;
    } else if (newIndex < 0) {
        // Si l'index est inférieur à zéro, passer à la dernière image
        openLightbox(images[images.length - 1].src, images);
        currentImageIndex = images.length - 1;
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
            closeLightbox()
        } else if (event.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (event.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
    }
});
