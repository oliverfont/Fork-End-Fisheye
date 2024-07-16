// Import des fonctions et classes nécessaires
import { MediaFactory } from './media.js';
import { openLightbox } from './lightbox.js';

// Déclaration de variables globales
let images = [];
let totalLikes = 0;
const mediaFactory = new MediaFactory();

// Fonction pour charger les médias d'un photographe
export async function chargerMedias(photographerId, cheminDossierImages) {
    try {
        // Récupération des données des photographes à partir du fichier JSON
        const response = await fetch("/data/photographers.json");
        const data = await response.json();
        const mediaArray = data.media;

        images = [];
        totalLikes = 0; // Réinitialiser totalLikes lors du chargement des médias

        // Parcourir les médias et les ajouter à la galerie s'ils appartiennent au photographe
        for (let mediaData of mediaArray) {
            if (mediaData.photographerId === photographerId) {
                const dateParts = mediaData.date.split('-');
                const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

                // Création d'un objet Media pour chaque média
                const media = mediaFactory.createMedia(
                    `${cheminDossierImages}/${mediaData.video || mediaData.image}`,
                    mediaData.likes,
                    `${cheminDossierImages}/${mediaData.thumbnail}`, // Utiliser la miniature prédéfinie
                    mediaData.title,
                    formattedDate
                );

                // Additionner les likes lors du chargement
                totalLikes += media.likes;

                // Création de l'élément article pour afficher le média
                const container = document.createElement('article');
                container.classList.add('photo-container');
                container.setAttribute('data-date', formattedDate.toISOString());

                const formattedTitle = mediaData.title.replace(/_/g, ' ');

                const titleContainer = document.createElement('div');
                titleContainer.classList.add('title-container');

                const titleElement = document.createElement('p');
                titleElement.classList.add('media-title');
                titleElement.innerText = formattedTitle;

                titleContainer.appendChild(titleElement);
                container.appendChild(titleContainer);

                // Création de l'élément cliquable pour ouvrir la lightbox
                const clickableImage = await media.createClickableImageElement(images);

                clickableImage.addEventListener('click', async (event) => {
                    event.preventDefault();

                    if (media.isVideo()) {
                        openLightbox(media.file, images, true);
                    } else {
                        openLightbox(media.file, images);
                    }
                });

                container.appendChild(clickableImage);

                const infoContainer = document.createElement('div');
                infoContainer.classList.add('info-container');

                const likeContainer = document.createElement('div');
                likeContainer.classList.add('like-container');

                const likeCount = document.createElement('span');
                likeCount.classList.add('like-count');
                likeCount.innerText = media.likes.toString();

                const likeIcon = document.createElement('span');
                likeIcon.classList.add('like-icon');
                likeIcon.innerText = '♥';
                likeIcon.tabIndex = 0;
                likeIcon.setAttribute('aria-label', `Like ${media.title}`);
                likeIcon.setAttribute('title', `Like ${media.title}`);

                // Gestion des likes
                let liked = false;
                const toggleLike = () => {
                    if (liked) {
                        media.likes--;
                        totalLikes--;
                        likeIcon.style.color = '#901C1C';  // Réinitialise la couleur à la valeur par défaut
                    } else {
                        media.likes++;
                        totalLikes++;
                        likeIcon.style.color = '#FF0000';  // Définit la couleur à rouge quand on like
                    }
                    likeCount.innerText = media.likes.toString();
                    updateTotalLikes(); // Met à jour les likes totaux dans l'aside
                    liked = !liked;

                    // Vérifiez si le tri est par popularité et mettez à jour la galerie
                    const triOption = document.getElementById('tri').value;
                    if (triOption === 'popularite') {
                        trierGalerie(triOption);
                    }
                };

                likeContainer.addEventListener('click', toggleLike);
                likeIcon.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        toggleLike();
                    }
                });

                likeContainer.appendChild(likeCount);
                likeContainer.appendChild(likeIcon);

                infoContainer.appendChild(titleContainer);
                infoContainer.appendChild(likeContainer);

                container.appendChild(infoContainer);

                document.getElementById('imageGallery').appendChild(container);

                images.push({ src: media.file, likes: media.likes, title: media.title, date: media.date, isVideo: media.isVideo() });
            }
        }

        // Trier la galerie par date par défaut et mettre à jour les likes totaux
        trierGalerie('date');
        updateTotalLikes();

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
}

// Fonction pour trier la galerie
export function trierGalerie(triOption) {
    switch (triOption) {
        case 'popularite':
            images.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            images.sort((a, b) => b.date - a.date);
            break;
        case 'titre':
            images.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }
    updateGallery(images);
}

// Fonction pour mettre à jour la galerie avec les images triées
function updateGallery(sortedImages) {
    const galerie = document.getElementById('imageGallery');
    const containers = Array.from(galerie.children);

    sortedImages.forEach(media => {
        const container = containers.find(cont => {
            const title = cont.querySelector('.media-title').innerText;
            return title === media.title;
        });

        galerie.appendChild(container);
    });
}

// Fonction pour mettre à jour le total des likes affiché dans l'aside
function updateTotalLikes() {
    const totalLikeInfo = document.querySelector('.total-likes');
    if (totalLikeInfo) {
        totalLikeInfo.innerHTML = `${totalLikes} ♥`;
    }
}

// Fonction pour récupérer les images (utilisée dans photographer.js)
export function getImages() {
    return images;
}
