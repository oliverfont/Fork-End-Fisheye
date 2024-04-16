// Événement déclenché lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', async function () {    
    // Récupération des paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');
    const photographerPrice = urlParams.get('price');

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

    async function getMedia() {
        try {
            const response = await fetch("/data/photographers.json");
            const data = await response.json();
            console.log("Media data:", data.media);
            
            return data.media.map(media => ({
                id: media.id,
                photographerId: media.photographerId,
                title: media.title,
                image: media.image,
                likes: media.likes,
                date: new Date(media.date) // Convertir la date en objet Date JavaScript
            }));
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des médias :', error);
            return []; // Retourner un tableau vide en cas d'erreur
        } 
    }

    // Fonction pour trier la galerie sans recharger les images
function trierGalerie(triOption, images) {
    switch (triOption) {
        case 'popularite':
            images.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            images.sort((a, b) => {
                const dateA = a.date ? a.date : new Date(); // Si la date est non définie, utilisez la date actuelle
                const dateB = b.date ? b.date : new Date(); // Si la date est non définie, utilisez la date actuelle
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
        const containers = Array.from(galerie.children);

        // Réorganiser les containers dans le DOM selon l'ordre des médias triés
        sortedImages.forEach(media => {
            const container = containers.find(cont => {
                const title = cont.querySelector('.media-title').innerText;
                return title === media.title;
            });

            galerie.appendChild(container);
        });
    }

    // Fonction pour trier la galerie en fonction de l'option choisie
    function updateGalleryOrder(orderBy) {
        const galerie = document.getElementById('imageGallery');
        const containers = Array.from(galerie.querySelectorAll('.photo-container'));

        // Trier les containers selon l'ordre souhaité
        containers.sort((a, b) => {
            const likesA = parseInt(a.querySelector('.like-count').innerText);
            const likesB = parseInt(b.querySelector('.like-count').innerText);
        
            switch (orderBy) {
                case 'popularite':
                    return likesB - likesA; // Trie du plus liké au moins liké
                case 'date':
                    const dateA = new Date(a.querySelector('.date').innerText);
                    const dateB = new Date(b.querySelector('.date').innerText);
                    // Trie par date chronologique, du plus récent au plus ancien
                    return dateB - dateA;
                case 'titre':
                    const titleA = a.querySelector('.media-title').innerText;
                    const titleB = b.querySelector('.media-title').innerText;
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });
        

        // Effacez le contenu actuel de la galerie
        galerie.innerHTML = '';

        // Retournez les containers triés
        return containers;
    }

    // Écouteur d'événement pour le changement d'option de tri
    document.getElementById('tri').addEventListener('change', function () {
        const triOption = this.value;
        // Appelez la fonction pour trier la galerie avec l'option choisie
        const sortedContainers = updateGalleryOrder(triOption);
        // Mettez à jour la galerie avec les containers triés
        sortedContainers.forEach(container => {
            galerie.appendChild(container);
        });
    });

    async function captureVideoThumbnail(videoUrl) {
        try {
            const firstPartOfName = photographerName.split(' ')[0];
            const thumbnailPath = determineThumbnailPath(videoUrl, firstPartOfName);
            console.log('Thumbnail Path:', thumbnailPath);

            const video = document.createElement('video');
            video.src = videoUrl;
            await video.load();

            const thumbnail = await captureVideoFrame(video);

            // Ajoutez la vidéo à la liste des images avec la miniature
            images.push({
                src: videoUrl,
                likes: 0, // Vous pouvez ajuster cela en fonction de vos besoins
                title: '', // Vous pouvez ajuster cela en fonction de vos besoins
                isVideo: true,
                thumbnail: thumbnail,
            });

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
        constructor(file, likes, thumbnail, title, date) {
            this.file = file;
            this.likes = likes;
            this.thumbnail = thumbnail;
            this.title = title;
            this.date = date;
        }

        async createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;

            if (this.isVideo()) {
                // Si c'est une vidéo, créez une miniature pour la galerie
                const thumbnailSrc = await this.createVideoThumbnail();
                const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
                linkElement.appendChild(thumbnailImageElement);
            } else {
                // Si ce n'est pas une vidéo, créez un élément image normal pour la galerie
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
            }

            return linkElement;
        }

        createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media', 'gallery-img');
            videoElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);

            return videoElement;
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

        async captureVideoThumbnail(videoElement) {
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
        createMedia(file, likes, thumbnail, title, date, isVideo) {
            return new Media(file, likes, thumbnail, title, date, isVideo);
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
                    // Convertissez la chaîne de date en objet Date
                    const dateParts = mediaData.date.split('-');
                    const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
                    const media = new Media(
                        `${cheminDossierImages}/${mediaData.video || mediaData.image}`,
                        mediaData.likes,
                        `${cheminDossierImages}/${mediaData.thumbnail}`,
                        mediaData.title,
                        mediaData.date ? new Date(mediaData.date) : new Date()
                    );
                    
                    const container = document.createElement('article');
                    container.classList.add('photo-container');
            
                    if (media.isVideo()) {
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

                    clickableImage.addEventListener('click', async (event) => {
                        event.preventDefault();
                    
                        if (media.isVideo()) {
                            // Si c'est une vidéo, ouvre la lightbox avec le lecteur vidéo
                            const videoUrl = media.file;
                            const thumbnailSrc = await captureVideoThumbnail(videoUrl);
                            openLightbox(videoUrl, images, true, thumbnailSrc);
                            currentMediaIndex = index;
                        } else {
                            // Si c'est une image, ouvre la lightbox avec l'image
                            openLightbox(media.file, images);
                            currentMediaIndex = index;
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
                            totalLikes--;
                            likeIcon.style.color = '';  // Réinitialise la couleur à la valeur par défaut
                        } else {
                            media.likes++;
                            totalLikes++;
                            likeIcon.style.color = '#ff0000';  // Définit la couleur à rouge (#ff0000)
                        }
                        likeCount.innerText = media.likes.toString();
                        totalLikeInfo.innerHTML = `${totalLikes} ♥`;
                    
                        liked = !liked;
                    });                            likeIcon.style.color = '#ff0000';  // Définit la couleur à rouge (#ff0000)

                        
                    images.push({ src: media.file, likes: media.likes, title: media.title });
                }
            }

            // Tri du tableau d'images avant de le charger dans la galerie
            trierGalerie('date', images);
            console.log('Tableau d\'images:', images);

            let totalLikes = images.reduce((total, media) => total + media.likes, 0);
            const asideInfo = document.querySelector('aside');
            const prixInfo = document.createElement('p');
            const totalLikeInfo = document.createElement('p');
            

            prixInfo.innerHTML = `${photographerPrice}€ / jour`;
            totalLikeInfo.innerHTML = `${totalLikes} ♥`;
            
            asideInfo.appendChild(totalLikeInfo);
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
