// Fonction pour afficher la lightbox avec une image
function openLightbox(imageSrc) {
    // Créer les éléments nécessaires
    const overlay = document.createElement('div');
    overlay.classList.add('lightbox-overlay');

    const modal = document.createElement('div');
    modal.classList.add('lightbox-modal');

    const image = document.createElement('img');
    image.src = imageSrc;

    // Ajoute les éléments au DOM
    modal.appendChild(image);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Gérer la fermeture de la lightbox
    overlay.addEventListener('click', closeLightbox);
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.getElementById('customLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close');
    const triggerImages = document.querySelectorAll('.custom-lightbox-trigger');

    // Fonction pour afficher la modal avec l'image cliquée
    function openLightbox(imageSrc) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'block';
    }

    // Fermer la modal en cliquant sur le bouton de fermeture
    closeBtn.addEventListener('click', function () {
        lightbox.style.display = 'none';
    });

    // Fermer la modal en cliquant à l'extérieur de la modal
    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Attacher l'événement de clic à chaque image déclencheur
    triggerImages.forEach(function (image) {
        image.addEventListener('click', function () {
            openLightbox(image.src);
        });
    });
});