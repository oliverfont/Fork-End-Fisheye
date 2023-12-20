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

        display() {
            console.log(`Affichage de ${this.file}`);
            const mediaElement = this.isVideo() ? this.createVideoElement() : this.createImageElement();
            mediaElement.onload = () => {
                console.log(`Le média ${this.file} a été chargé avec succès.`);
                galerie.appendChild(mediaElement);
            };
            mediaElement.src = this.file;
        }

        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file; // Lien vers l'image en taille réelle
        
            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);
        
            // Ajoutez un gestionnaire d'événements au clic pour ouvrir le carrousel
            linkElement.addEventListener('click', (event) => {
                event.preventDefault();
                // Ajoutez ici le code pour ouvrir le carrousel et afficher l'image
                // Vous pouvez utiliser une bibliothèque comme Fancybox, Lightbox, etc.
                // Ou mettre en œuvre votre propre solution de carrousel.
            });
        
            return linkElement;
        }        
        

        createVideoThumbnail(videoElement) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
        
                // Assurez-vous que la toile a la même taille que la vidéo
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
        
                // Dessinez le premier frame de la vidéo sur le canvas
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
                // Convertissez l'image capturée en base64 pour l'utiliser comme miniature
                const thumbnailDataUrl = canvas.toDataURL();
                resolve(thumbnailDataUrl);
            });
        }
        

        createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media');
            videoElement.controls = true;
        
            // Ajoutez une source au lecteur vidéo
            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';
        
            videoElement.appendChild(sourceElement);
        
            videoElement.addEventListener('loadeddata', async () => {
                const thumbnail = await this.createVideoThumbnail(videoElement);
                galerie.appendChild(this.createThumbnailImageElement(thumbnail));
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
            return imageElement;
        }

        isVideo() {
            return this.file.toLowerCase().endsWith('.mp4');
        }

        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;
            linkElement.target = '_blank'; // Ouvrir dans un nouvel onglet

            const imageElement = this.createImageElement();
            linkElement.appendChild(imageElement);

            // Ajoutez un gestionnaire d'événements au clic pour ouvrir le carrousel
            linkElement.addEventListener('click', (event) => {
                event.preventDefault();
                // Ajoutez ici le code pour ouvrir le carrousel et afficher l'image
                // Vous pouvez utiliser une bibliothèque comme Fancybox, Lightbox, etc.
                // Ou mettre en œuvre votre propre solution de carrousel.
            });

            return linkElement;
        }
    }

    // Factory pour créer des instances de Media
    class MediaFactory {
        createMedia(file) {
            return new Media(file);
        }
    }

    // Utilisez seulement la première partie du nom du photographe pour le chemin
    const firstPartOfName = photographerName.split(' ')[0];
    const cheminDossierImages = new URL(`/assets/photographers/Photos/${firstPartOfName}/`, window.location.href);
    const galerie = document.getElementById('imageGallery');

    // Utilisez la Factory pour créer des instances de Media
    const mediaFactory = new MediaFactory();

    async function chargerMedias() {
        try {
            const response = await fetch(cheminDossierImages);
            if (!response.ok) {
                console.error('Erreur lors de la requête fetch. Statut :', response.status);
                throw new Error('Impossible de charger la liste des fichiers.');
            }

            const htmlContent = await response.text();

            // Créer un conteneur temporaire pour analyser le HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlContent;

            // Sélectionner tous les liens (a) dans le répertoire
            const links = tempContainer.querySelectorAll('a');

            // Filtrer les liens pour obtenir les noms de fichiers
            const fichiers = Array.from(links)
                .map(link => link.getAttribute('href'))
                .filter(href => href.includes(firstPartOfName));

            // Parcourir la liste des fichiers et créer des instances de Media
            fichiers.forEach(fichier => {
                const url = new URL(`${fichier}`, cheminDossierImages);
                const media = mediaFactory.createMedia(url.href);
                media.display();
            });

        } catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
        }
    }

    // Appel de la fonction pour charger les médias lors du chargement de la page
    window.onload = chargerMedias;
});
