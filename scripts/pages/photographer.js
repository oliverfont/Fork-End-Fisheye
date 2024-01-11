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

    async function captureVideoThumbnail(videoUrl) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.onloadeddata = async () => {
                try {
                    const thumbnail = await captureVideoFrame(video);
                    resolve(thumbnail);
                } catch (error) {
                    reject(error);
                }
            };
            video.load();
        });
    }

    async function captureVideoFrame(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Créer une miniature pour la vidéo en utilisant l'image capturée
        const thumbnailImageElement = document.createElement('img');
        thumbnailImageElement.src = canvas.toDataURL();
        thumbnailImageElement.classList.add('gallery-media', 'gallery-img');
        galerie.appendChild(thumbnailImageElement);

        return canvas.toDataURL();
    }

    class Media {
        constructor(file, likes, thumbnail) {
            this.file = file;
            this.likes = likes;
            this.thumbnail = thumbnail;  // Ajout du champ pour l'image miniature des vidéos
        }

        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;

            if (this.isVideo()) {
                this.createVideoElement().then(videoElement => {
                    linkElement.appendChild(videoElement);
                });
            } else {
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
            }

            return linkElement;
        }

        async createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media');
            videoElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);

            // Créer une miniature pour la vidéo en utilisant la miniature fournie
            const thumbnailImageElement = this.createThumbnailImageElement(this.thumbnail);
            galerie.appendChild(thumbnailImageElement);

            return videoElement;
        }

        createImageElement() {
            const imageElement = new Image();
            imageElement.classList.add('gallery-media', 'gallery-img');
            imageElement.src = this.file;
            return imageElement;
        }

        createThumbnailImageElement(thumbnailSrc) {
            const thumbnailImage = this.createImageElement();
            thumbnailImage.src = thumbnailSrc;
            return thumbnailImage;
        }

        isVideo() {
            return this.file.toLowerCase().endsWith('.mp4');
        }
    }

    class MediaFactory {
        createMedia(file, likes, thumbnail) {
            return new Media(file, likes, thumbnail);
        }
    }

    const firstPartOfName = photographerName.split(' ')[0];
    const cheminDossierImages = `/assets/photographers/Photos/${firstPartOfName}/`; // Chemin généré dynamiquement
    const galerie = document.getElementById('imageGallery');

    const mediaFactory = new MediaFactory();

    async function chargerMedias() {
        try {
            const photographersResponse = await fetch("/data/photographers.json");
            const photographersData = await photographersResponse.json();
            const photographers = photographersData.photographers;

            const mediaResponse = await fetch("/data/photographers.json");
            const mediaData = await mediaResponse.json();
            const mediaArray = mediaData.media;

            const photographer = photographers.find(p => p.name === photographerName);

            if (!photographer) {
                console.error('Photographer not found');
                return;
            }

            const photographerId = photographer.id;

            const images = [];

            mediaArray.forEach(async (mediaData, index) => {
                if (mediaData.photographerId === photographerId) {
                    const media = new Media(
                        `${cheminDossierImages}/${mediaData.image}`,
                        mediaData.likes
                    );

                    const container = document.createElement('div');
                    container.classList.add('photo-container');

                    const formattedTitle = mediaData.title.replace(/_/g, ' ');

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

                    const infoContainer = document.createElement('div');
                    infoContainer.classList.add('info-container');

                    const likeContainer = document.createElement('div');
                    likeContainer.classList.add('like-container');

                    const likeCount = document.createElement('span');
                    likeCount.classList.add('like-count');
                    likeCount.innerText = media.likes.toString();

                    const likeIcon = document.createElement('span');
                    likeIcon.classList.add('like-icon');
                    likeIcon.innerText = '❤️';

                    likeContainer.appendChild(likeCount);
                    likeContainer.appendChild(likeIcon);

                    infoContainer.appendChild(titleContainer);
                    infoContainer.appendChild(likeContainer);

                    container.appendChild(infoContainer);

                    galerie.appendChild(container);

                    let liked = false;

                    likeContainer.addEventListener('click', () => {
                        if (!liked) {
                            media.likes++;
                            likeCount.innerText = media.likes.toString();
                            liked = true;
                        }
                    });

                    images.push({ src: media.file, likes: media.likes });
                }
            });

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

    // Fonction pour générer dynamiquement le chemin des vidéos
    function generateCheminDossierVideos(firstName) {
        return `/assets/photographers/Photos/${firstName}/`;
    }

    // Appel de la fonction pour charger les médias lors du chargement de la page
    window.onload = chargerMedias;
});
