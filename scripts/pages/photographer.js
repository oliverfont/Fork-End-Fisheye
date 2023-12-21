document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');

    // Créer les éléments nécessaires
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

    // Ajouter les éléments au DOM
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);
    photograpHeader.appendChild(infoContainer);
    photograpHeader.appendChild(photoElement);

    // Mettre à jour le contenu des éléments
    nameElement.innerText = photographerName;
    locationElement.innerText = photographerLocation;
    taglineElement.innerText = photographerTagline;
    photoElement.src = photographerPhoto;

    // Définition de la classe Media
    class Media {
        constructor(file) {
            this.file = file;
        }

        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;
            linkElement.dataset.fancybox = 'gallery'; // Ajoute l'attribut pour regrouper les images dans un carrousel

            if (this.isVideo()) {
                // Si c'est une vidéo, crée une miniature à partir de la première image
                this.createVideoThumbnail().then(thumbnailSrc => {
                    const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
                    linkElement.appendChild(thumbnailImageElement);
                });
            } else {
                // Si c'est une image, crée l'élément image
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
    
            // Ajoute une source au lecteur vidéo
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
    

    // Factory pour créer des instances de Media
    class MediaFactory {
        createMedia(file) {
            return new Media(file);
        }
    }

    // Utilise seulement la première partie du nom du photographe pour le chemin
    const firstPartOfName = photographerName.split(' ')[0];
    const cheminDossierImages = new URL(`/assets/photographers/Photos/${firstPartOfName}/`, window.location.href);
    const galerie = document.getElementById('imageGallery');

    // Utilise la Factory pour créer des instances de Media
    const mediaFactory = new MediaFactory();

    async function chargerMedias() {
        try {
            const response = await fetch(cheminDossierImages);
            if (!response.ok) {
                console.error('Erreur lors de la requête fetch. Statut :', response.status);
                throw new Error('Impossible de charger la liste des fichiers.');
            }
    
            const htmlContent = await response.text();
    
            // Crée un conteneur temporaire pour analyser le HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlContent;
    
            // Sélectionner tous les liens (a) dans le répertoire
            const links = tempContainer.querySelectorAll('a');
    
            // Filtre les liens pour obtenir les noms de fichiers
            const fichiers = Array.from(links)
                .map(link => link.getAttribute('href'))
                .filter(href => href.includes(firstPartOfName))
                .filter(href => /\.(jpg|jpeg|png|mp4)$/i.test(href)); // Filtre par extensions
    
            // Parcourir la liste des fichiers et créer des instances de Media
            fichiers.forEach(fichier => {
                const url = new URL(`${fichier}`, cheminDossierImages);
                const media = mediaFactory.createMedia(url.href);
                const clickableImage = media.createClickableImageElement();
                galerie.appendChild(clickableImage);
            });
    
            // Activer la lightbox après avoir ajouté les éléments
            const images = document.querySelectorAll('.gallery-img');
            images.forEach(image => {
                image.addEventListener('click', () => {
                    const imageUrl = image.src; // Obtenez l'URL de l'image
                    openLightbox(imageUrl);
                });
            });
    
        } catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
        }
    }

    // Appel de la fonction pour charger les médias lors du chargement de la page
    window.onload = chargerMedias;
});
