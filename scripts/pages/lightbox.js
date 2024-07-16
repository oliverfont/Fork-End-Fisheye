// lightbox.js
let lightboxIsOpen = false;
let images = [];
let currentMediaIndex = 0;

export function openLightbox(mediaUrl, mediaList, isVideo = false) {
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

    lightboxMedia.innerHTML = '';

    if (isVideo) {
        const videoElement = createVideoElement(mediaUrl);
        lightboxMedia.appendChild(videoElement);
    } else {
        const imageElement = createImageElement(mediaUrl);
        lightboxMedia.appendChild(imageElement);

        if (images[currentMediaIndex]) {
            const titleElement = document.createElement('p');
            titleElement.classList.add('lightbox-title');
            titleElement.innerText = images[currentMediaIndex].title;
            lightboxMedia.appendChild(titleElement);
        } else {
            console.error('Media not found at currentMediaIndex');
        }
    }

    lightbox.style.display = 'flex';
    lightboxIsOpen = true;

    const nextBtn = document.querySelector('.next');
    nextBtn.tabIndex = 0;
    nextBtn.setAttribute('title', 'Next media');
    const prevBtn = document.querySelector('.prev');
    prevBtn.tabIndex = 0;
    prevBtn.setAttribute('title', 'Previous media');
    const closeBtn = document.querySelector('.close');
    closeBtn.tabIndex = 0;
    closeBtn.setAttribute('title', 'Close lightbox');
    closeBtn.setAttribute('role', 'button');
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            closeLightbox();
        }
    });

    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.focus();
}

export function closeLightbox() {
    const lightbox = document.getElementById('customLightbox');
    lightbox.style.display = 'none';
    lightboxIsOpen = false;
}

export function navigateLightbox(direction) {
    currentMediaIndex = (currentMediaIndex + direction + images.length) % images.length;

    if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
        const newMedia = images[currentMediaIndex];
        const newMediaUrl = newMedia.src;
        const newMediaIsVideo = newMedia.isVideo;

        openLightbox(newMediaUrl, images, newMediaIsVideo);
    }
}

function createImageElement(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.classList.add('lightbox-media');
    imageElement.src = imageUrl;
    imageElement.alt = 'Image in lightbox';
    return imageElement;
}

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

document.querySelector('.next').addEventListener('click', () => {
    navigateLightbox(1);
});

document.querySelector('.prev').addEventListener('click', () => {
    navigateLightbox(-1);
});
