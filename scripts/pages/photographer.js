// Événement déclenché lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', async function () {    
    // Récupération des paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');

    // Sélection de l'élément d'en-tête du photographe dans le DOM
    const photograpHeader = document.querySelector('.photograph-header');
    // Création des éléments pour afficher les informations du photographe
    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');

    const locationElement = document.createElement('p');
    locationElement.classList.add('location');

    const taglineElement = document.createElement('p');
    taglineElement.classList.add('tagline');

    const photoElement = document.createElement('img');
    photoElement.classList.add('photo');

    const infoContainer = document.createElement('div');

    // Organisation des éléments dans l'en-tête du photographe
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);
    photograpHeader.appendChild(infoContainer);
    photograpHeader.appendChild(photoElement);

    // Remplissage des éléments avec les informations du photographe
    nameElement.innerText = photographerName;
    locationElement.innerText = photographerLocation;
    taglineElement.innerText = photographerTagline;
    photoElement.src = photographerPhoto;

    // Ajout de l'événement pour le tri
    document.getElementById('tri').addEventListener('change', function () {
        const triOption = this.value;
        // Appelez la fonction de tri avec l'option choisie et les images actuelles
        trierGalerie(triOption, images);
    });

    // Fonction pour trier la galerie sans recharger les images
// Fonction pour trier la galerie sans recharger les images
function trierGalerie(triOption, images) {
    switch (triOption) {
        case 'popularite':
            images.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            images.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            break;
        case 'titre':
            images.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }

    // Appelez la fonction pour mettre à jour la galerie avec les images triées
    updateGallery(images);
}

    // Fonction pour mettre à jour la galerie avec les images triées
    function updateGallery(sortedImages) {
        const galerie = document.getElementById('imageGallery');

        // Réorganisez les éléments existants dans la galerie sans rechargement
        sortedImages.forEach((media, index) => {
            const container = galerie.children[index];
            galerie.appendChild(container);
        });
    }

    async function captureVideoThumbnail(videoUrl) {
        try {
            const firstPartOfName = photographerName.split(' ')[0];
            const thumbnailPath = determineThumbnailPath(videoUrl, firstPartOfName);
            console.log('Thumbnail Path:', thumbnailPath);
    
            const video = document.createElement('video');
            video.src = videoUrl;
            await video.load();
    
            const thumbnail = await captureVideoFrame(video);
            return thumbnail;
        } catch (error) {
            console.error('Error capturing video thumbnail:', error);
            throw error;
        }
    }
    
    function determineThumbnailPath(videoUrl, firstPartOfName) {
        const videoFileName = videoUrl.split('/').pop();
        const thumbnailFileName = videoFileName.replace('.mp4', '_thumbnail.jpg');
        return `/assets/photographers/Photos/${firstPartOfName}/${thumbnailFileName}`;
    }
    

// Fonction asynchrone pour capturer une image d'une vidéo donnée
async function captureVideoFrame(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Retourne le chemin de la miniature au lieu d'ajouter au DOM
    return canvas.toDataURL("image/jpeg");
}

    // Classe représentant un média (image ou vidéo)
    class Media {
        constructor(file, likes, thumbnail, title) {
            this.file = file;
            this.likes = likes;
            this.thumbnail = thumbnail;
            this.title = title;
        }

        async createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;

            if (this.isVideo()) {
                const videoElement = await this.createVideoElement();
                linkElement.appendChild(videoElement);
            } else {
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
            }

            return linkElement;
        }

        async createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media', 'gallery-img');
            videoElement.controls = true;
        
            // Capture de la miniature de manière synchrone
            const thumbnailSrc = await captureVideoThumbnail(this.file);
        
            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';
        
            videoElement.appendChild(sourceElement);
        
            // Afficher l'aperçu dans la console
            console.log('Thumbnail created:', thumbnailSrc);
        
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
    const cheminDossierImages = `/assets/photographers/Photos/${firstPartOfName}/`;
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
            if (!photographerName) {
                console.error('Photographer name not provided');
                return;
            }
    
            const firstPartOfName = photographerName.split(' ')[0];
    
    
            const photographerId = photographer.id;
    
            const images = [];
    
            for (let index = 0; index < mediaArray.length; index++) {
                const mediaData = mediaArray[index];
    
                if (mediaData.photographerId === photographerId) {
                    const media = new Media(
                        `${cheminDossierImages}/${mediaData.image}`,
                        mediaData.likes,
                        `${cheminDossierImages}/${mediaData.thumbnail}`,
                        mediaData.title
                    );
    
                    const container = document.createElement('div');
                    container.classList.add('photo-container');
    
                    if (media.isVideo()) {
                        await captureVideoThumbnail(media.file, galerie);
                    }
    
                    const formattedTitle = mediaData.title.replace(/_/g, ' ');
    
                    const titleContainer = document.createElement('div');
                    titleContainer.classList.add('title-container');
    
                    const titleElement = document.createElement('p');
                    titleElement.classList.add('media-title');
                    titleElement.innerText = formattedTitle;
    
                    titleContainer.appendChild(titleElement);
                    container.appendChild(titleContainer);
    
                    const clickableImage = await media.createClickableImageElement();
    
                    clickableImage.addEventListener('click', (event) => {
                        event.preventDefault();
                        const mediaUrl = media.file;
                        openLightbox(mediaUrl, images);
                        currentMediaIndex = index;
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
                        if (liked) {
                            media.likes--;
                        } else {
                            media.likes++;
                        }
                        likeCount.innerText = media.likes.toString();
    
                        liked = !liked;
                    });
    
                    images.push({ src: media.file, likes: media.likes, title: media.title });
                }
            }

                // Tri du tableau d'images avant de le charger dans la galerie
            trierGalerie('date', images);
            console.log('Tableau d\'images:', images);
    
            const totalLikes = images.reduce((total, media) => total + media.likes, 0);
            const asideInfo = document.querySelector('aside');
            const prixInfo = document.createElement('p');
            const totaLikeInfo = document.createElement('p')
            prixInfo.innerHTML = `${photographer.price}€ / jour`;
            totaLikeInfo.innerHTML = `${totalLikes} ❤️`;
            asideInfo.appendChild(totaLikeInfo); 
            asideInfo.appendChild(prixInfo);   

            const imagesInGallery = document.querySelectorAll('.gallery-img');
            imagesInGallery.forEach((image, index) => {
                image.addEventListener('click', () => {
                    openLightbox(images[index].src, images);
                    currentMediaIndex = index;
                });
            });
        } catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
        }
    }    

    const openModal = document.querySelector('.contact_button');
    const modal = document.querySelector('.modal');

    openModal.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        } else if (event.target === modal) {
            closeModal();
        }
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

    window.onload = chargerMedias;
});
