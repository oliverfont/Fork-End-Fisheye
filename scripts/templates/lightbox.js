let lightboxIsOpen = false;
let currentImageIndex = 0;
let images = [];

// Fonction pour ouvrir la lightbox
function openLightbox(imageUrl) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxImg.src = imageUrl;
    lightbox.style.display = 'flex';
    lightboxIsOpen = true;  // ! mettre à jour la variable lightboxIsOpen
}

    // Fermer la lightbox en cliquant sur le bouton de fermeture
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', function () {
        lightbox.style.display = 'none';
    });

    // Fermer la lightbox en cliquant à l'extérieur de la lightbox
    window.addEventListener('click', function (event) {function openLightbox(imageUrl) {
        const lightbox = document.getElementById('customLightbox');
        const lightboxImg = document.getElementById('lightboxImg');
    
        lightboxImg.src = imageUrl;
        lightbox.style.display = 'flex';
    
        // Fermer la lightbox en cliquant sur le bouton de fermeture
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', function () {
            lightbox.style.display = 'none';
        });
    
        // Fermer la lightbox en cliquant à l'extérieur de la lightbox
        window.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    
// Écouteurs d'événements pour la navigation dans la lightbox
document.addEventListener('keydown', (event) => {
    // Vérifiez si la lightbox est ouverte
    if (lightboxIsOpen) {
        // Touche "Escape" pour fermer la lightbox
        if (event.key === 'Escape') {
            closeLightbox();
        }
        // Touche "ArrowRight" pour passer à l'image suivante
        else if (event.key === 'ArrowRight') {
            navigateLightbox(1);
        }
        // Touche "ArrowLeft" pour passer à l'image précédente
        else if (event.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
    }
});

// Fonction pour naviguer dans la lightbox
function navigateLightbox(direction) {
    const newIndex = currentImageIndex + direction;
    // Assurez-vous que le nouvel index est dans la plage valide
    if (newIndex >= 0 && newIndex < images.length) {
        const newImageUrl = images[newIndex].src;
        openLightbox(newImageUrl);
        currentImageIndex = newIndex;
    }
}