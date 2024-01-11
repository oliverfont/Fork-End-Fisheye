document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');

    const photograpHeader = document.querySelector('.photograph-header');
    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');

    const locationElement = document.createElement('p');
    locationElement.classList.add('location');

    const taglineElement = document.createElement('p');
    taglineElement.classList.add('tagline');

    const photoElement = document.createElement('img');
    photoElement.classList.add('photo');

    const infoContainer = document.createElement('div');

    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);
    photograpHeader.appendChild(infoContainer);
    photograpHeader.appendChild(photoElement);

    nameElement.innerText = photographerName;
    locationElement.innerText = photographerLocation;
    taglineElement.innerText = photographerTagline;
    photoElement.src = photographerPhoto;

    class Media {
        constructor(file) {
            this.file = file;
        }

        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;

            if (this.isVideo()) {
                this.createVideoThumbnail().then(thumbnailSrc => {
                    const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
                    linkElement.appendChild(thumbnailImageElement);
                });
            } else {
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
            }

            return linkElement;
        }

        async createVideoThumbnail() {
            return new Promise((resolve, reject) => {
                const videoElement = document.createElement('video');
                videoElement.src = this.file;
                videoElement.onloadeddata = async () => {
                    try {
                        const thumbnail = await this.captureVideoThumbnail(videoElement);
                        resolve(thumbnail);
                    } catch (error) {
                        reject(error);
                    }
                };
                videoElement.load();
            });
        }

        captureVideoThumbnail(videoElement) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                const thumbnailDataUrl = canvas.toDataURL();
                resolve(thumbnailDataUrl);
            });
        }

        createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media');
            videoElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);

            videoElement.addEventListener('loadeddata', async () => {
                const thumbnail = await this.createVideoThumbnail(videoElement);
                const thumbnailImageElement = this.createThumbnailImageElement(thumbnail);
                galerie.appendChild(thumbnailImageElement);
            });

            return videoElement;
        }

        createThumbnailImageElement(thumbnailSrc) {
            const thumbnailImage = this.createImageElement();
            thumbnailImage.src = thumbnailSrc;
            return thumbnailImage;
        }

        createImageElement() {
            const imageElement = new Image();
            imageElement.classList.add('gallery-media', 'gallery-img');
            imageElement.src = this.file;
            return imageElement;
        }

        isVideo() {
            return this.file.toLowerCase().endsWith('.mp4');
        }
    }

    class MediaFactory {
        createMedia(file) {
            return new Media(file);
        }
    }

    const firstPartOfName = photographerName.split(' ')[0];
    const cheminDossierImages = new URL(`/assets/photographers/Photos/${firstPartOfName}/`, window.location.href);
    const galerie = document.getElementById('imageGallery');

    const mediaFactory = new MediaFactory();

    async function chargerMedias() {
        try {
            const response = await fetch(cheminDossierImages);
            if (!response.ok) {
                console.error('Erreur lors de la requête fetch. Statut :', response.status);
                throw new Error('Impossible de charger la liste des fichiers.');
            }

            const htmlContent = await response.text();
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlContent;

            const links = tempContainer.querySelectorAll('a');
            const fichiers = Array.from(links)
                .map(link => link.getAttribute('href'))
                .filter(href => href.includes(firstPartOfName))
                .filter(href => /\.(jpg|jpeg|png|mp4)$/i.test(href));

            let images = [];

            fichiers.forEach((fichier, index) => {
                const url = new URL(`${fichier}`, cheminDossierImages);
                const media = mediaFactory.createMedia(url.href);
                const container = document.createElement('div');
                container.classList.add('photo-container');

                // Ajout du titre sous chaque image
                const pathParts = url.pathname.split('/');
                const lastPathPart = pathParts[pathParts.length - 1];
                const fileNameWithoutExtension = lastPathPart.split('.')[0];
                const formattedTitle = fileNameWithoutExtension.replace(/_/g, ' ');

                const titleContainer = document.createElement('div');
                titleContainer.classList.add('title-container');

                const titleElement = document.createElement('p');
                titleElement.classList.add('media-title');
                titleElement.innerText = formattedTitle;

                titleContainer.appendChild(titleElement);

                container.appendChild(titleContainer);

                const clickableImage = media.createClickableImageElement();
                clickableImage.addEventListener('click', (event) => {
                    event.preventDefault();
                    const mediaUrl = media.file;
                    openLightbox(mediaUrl, images);
                    currentImageIndex = index;
                });

                container.appendChild(clickableImage);

                // Ajout des éléments pour les likes et le titre
                const infoContainer = document.createElement('div');
                infoContainer.classList.add('info-container');

                const likeContainer = document.createElement('div');
                likeContainer.classList.add('like-container');

                const likeCount = document.createElement('span');
                likeCount.classList.add('like-count');
                likeCount.innerText = '0'; // Initialiser le nombre de likes à 0

                const likeIcon = document.createElement('span');
                likeIcon.classList.add('like-icon');
                likeIcon.innerText = '❤️'; // Utiliser n'importe quel symbole que vous préférez

                likeContainer.appendChild(likeCount);
                likeContainer.appendChild(likeIcon);

                infoContainer.appendChild(titleContainer);
                infoContainer.appendChild(likeContainer);

                container.appendChild(infoContainer);

                galerie.appendChild(container);

                // Événement pour incrémenter le nombre de likes lors du clic
                let likes = 0;  // Variable pour suivre le nombre de likes
                let liked = false;  // Variable pour suivre si l'image a déjà été aimée

                likeContainer.addEventListener('click', () => {
                    if (!liked) {
                        likes++;
                        likeCount.innerText = likes.toString();
                        liked = true;
                    }
                });

                images.push({ src: media.file, likes: 0 });
            });

// Fonction pour incrémenter les likes
function incrementLikes(index) {
    images[index].likes++;
    const likeCountElement = document.querySelector(`.like-container:nth-child(${index * 2 + 2}) .like-count`);
    likeCountElement.innerText = images[index].likes.toString();
}


            const imagesInGallery = document.querySelectorAll('.gallery-img');
            imagesInGallery.forEach((image, index) => {
                image.addEventListener('click', () => {
                    openLightbox(images[index].src, images);
                    currentImageIndex = index;
                });
            });

        } catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
        }
    }

    const openModal = document.querySelector('.contact_button');
    const modal = document.querySelector('.modal');
    const envoiForm = document.querySelector('.envoiForm');

    openModal.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    const prenom = document.querySelector("#prenom");
    const nom = document.querySelector("#nom");
    const email = document.querySelector("#email");
    const msg = document.querySelector("#msg");
    const form = document.querySelector('#formulaire');

    form.addEventListener('submit', finForm);

    function finForm(e) {
        e.preventDefault();
        console.log(`
        Prénom : ${prenom.value}
        Nom : ${nom.value}
        Email : ${email.value}
        Message : ${msg.value}`);
        modal.style.display = 'none';
    }

    // Appel de la fonction pour charger les médias lors du chargement de la page
    window.onload = chargerMedias;
});

