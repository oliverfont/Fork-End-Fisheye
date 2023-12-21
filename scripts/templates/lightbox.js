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

// Appeler cette fonction pour ouvrir la lightbox
// Par exemple, dans votre code existant, vous pouvez remplacer l'appel à Fancybox par cette fonction.
