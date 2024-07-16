// gallery.js
import { MediaFactory } from './media.js';
import { openLightbox } from './lightbox.js';

let images = [];
const mediaFactory = new MediaFactory(); // Créer une instance de MediaFactory

export async function chargerMedias(photographerId, cheminDossierImages) {
    try {
        const response = await fetch("/data/photographers.json");
        const data = await response.json();
        const mediaArray = data.media;

        images = [];

        for (let mediaData of mediaArray) {
            if (mediaData.photographerId === photographerId) {
                const dateParts = mediaData.date.split('-');
                const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

                const media = mediaFactory.createMedia(
                    `${cheminDossierImages}/${mediaData.video || mediaData.image}`,
                    mediaData.likes,
                    `${cheminDossierImages}/${mediaData.thumbnail}`,
                    mediaData.title,
                    formattedDate
                );

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

                const clickableImage = await media.createClickableImageElement();

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

                let liked = false;
                const toggleLike = () => {
                    if (liked) {
                        media.likes--;
                    } else {
                        media.likes++;
                    }
                    likeCount.innerText = media.likes.toString();
                    liked = !liked;
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

        trierGalerie('date', images);

        let totalLikes = images.reduce((total, media) => total + media.likes, 0);
        const totalLikeInfo = document.createElement('p');
        totalLikeInfo.innerHTML = `${totalLikes} ♥`;
        document.querySelector('aside').appendChild(totalLikeInfo);
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
}

export function trierGalerie(triOption, images) {
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
