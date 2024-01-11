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

    // Fonction asynchrone pour capturer une miniature de vidéo à partir de son URL
    async function captureVideoThumbnail(videoUrl) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.onloadeddata = async () => {
                try {
                    // Appel à la fonction pour capturer une image de la vidéo
                    const thumbnail = await captureVideoFrame(video);
                    resolve(thumbnail);
                } catch (error) {
                    reject(error);
                }
            };
            video.load();
        });
    }

    // Fonction asynchrone pour capturer une image d'une vidéo donnée
    async function captureVideoFrame(video) {
        // Création d'un élément canvas pour dessiner la vidéo
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Création d'une miniature pour la vidéo en utilisant l'image capturée
        const thumbnailImageElement = document.createElement('img');
        thumbnailImageElement.src = canvas.toDataURL();
        thumbnailImageElement.classList.add('gallery-media', 'gallery-img');
        galerie.appendChild(thumbnailImageElement);

        return canvas.toDataURL();
    }

    // Classe représentant un média (image ou vidéo)
    class Media {
        constructor(file, likes, thumbnail) {
            this.file = file;
            this.likes = likes;
            this.thumbnail = thumbnail;  // Ajout du champ pour l'image miniature des vidéos
        }

        // Création d'un élément cliquable (image ou vidéo)
        createClickableImageElement() {
            const linkElement = document.createElement('a');
            linkElement.href = this.file;

            // Si c'est une vidéo, créer un élément vidéo
            if (this.isVideo()) {
                this.createVideoElement().then(videoElement => {
                    linkElement.appendChild(videoElement);
                });
            } else {
                // Sinon, créer un élément image
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
            }

            return linkElement;
        }

        // Création d'un élément vidéo
        async createVideoElement() {
            const videoElement = document.createElement('video');
            videoElement.classList.add('gallery-media');
            videoElement.controls = true;

            const sourceElement = document.createElement('source');
            sourceElement.src = this.file;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);

            // Création d'une miniature pour la vidéo en utilisant la miniature fournie
            const thumbnailImageElement = this.createThumbnailImageElement(this.thumbnail);
            galerie.appendChild(thumbnailImageElement);

            return videoElement;
        }

        // Création d'un élément image
        createImageElement() {
            const imageElement = new Image();
            imageElement.classList.add('gallery-media', 'gallery-img');
            imageElement.src = this.file;
            return imageElement;
        }

        // Création d'un élément image miniature
        createThumbnailImageElement(thumbnailSrc) {
            const thumbnailImage = this.createImageElement();
            thumbnailImage.src = thumbnailSrc;
            return thumbnailImage;
        }

        // Vérification si le média est une vidéo
        isVideo() {
            return this.file.toLowerCase().endsWith('.mp4');
        }
    }

    // Classe responsable de la création d'objets Media
    class MediaFactory {
        createMedia(file, likes, thumbnail) {
            return new Media(file, likes, thumbnail);
        }
    }

    // Extraction du premier prénom du nom du photographe
    const firstPartOfName = photographerName.split(' ')[0];
    // Génération dynamique du chemin du dossier des images
    const cheminDossierImages = `/assets/photographers/Photos/${firstPartOfName}/`;
    // Sélection de l'élément galerie dans le DOM
    const galerie = document.getElementById('imageGallery');

    // Instance de la fabrique de médias
    const mediaFactory = new MediaFactory();

    // Fonction pour charger les médias du photographe actuel
    async function chargerMedias() {
        try {
            // Récupération des données des photographes depuis le fichier JSON
            const photographersResponse = await fetch("/data/photographers.json");
            const photographersData = await photographersResponse.json();
            const photographers = photographersData.photographers;

            // Récupération des données des médias depuis le fichier JSON
            const mediaResponse = await fetch("/data/photographers.json");
            const mediaData = await mediaResponse.json();
            const mediaArray = mediaData.media;

            // Recherche du photographe correspondant au nom passé en paramètre
            const photographer = photographers.find(p => p.name === photographerName);

            // Si le photographe n'est pas trouvé, afficher une erreur
            if (!photographer) {
                console.error('Photographer not found');
                return;
            }

            // Récupération de l'identifiant du photographe
            const photographerId = photographer.id;

            // Tableau pour stocker les informations sur les images à afficher
            const images = [];

            // Parcours des données des médias
            mediaArray.forEach((mediaData, index) => {
                // Vérification si le média appartient au photographe actuel
                if (mediaData.photographerId === photographerId) {
                    // Création d'un objet Media avec les informations du média
                    const media = new Media(
                        `${cheminDossierImages}/${mediaData.image}`,
                        mediaData.likes
                    );

                    // Création d'un conteneur pour le média
                    const container = document.createElement('div');
                    container.classList.add('photo-container');

                    // Formatage du titre du média
                    const formattedTitle = mediaData.title.replace(/_/g, ' ');

                    // Création du conteneur du titre
                    const titleContainer = document.createElement('div');
                    titleContainer.classList.add('title-container');

                    // Création de l'élément de titre
                    const titleElement = document.createElement('p');
                    titleElement.classList.add('media-title');
                    titleElement.innerText = formattedTitle;

                    // Ajout du titre au conteneur
                    titleContainer.appendChild(titleElement);

                    // Ajout du conteneur du titre au conteneur principal
                    container.appendChild(titleContainer);

                    // Création de l'élément cliquable du média
                    const clickableImage = media.createClickableImageElement();

                    // Ajout d'un gestionnaire d'événement pour ouvrir la lightbox
                    clickableImage.addEventListener('click', (event) => {
                        event.preventDefault();
                        const mediaUrl = media.file;
                        openLightbox(mediaUrl, images);
                        currentImageIndex = index;
                    });

                    // Ajout de l'élément cliquable au conteneur principal
                    container.appendChild(clickableImage);

                    // Création du conteneur des informations
                    const infoContainer = document.createElement('div');
                    infoContainer.classList.add('info-container');

                    // Création du conteneur des likes
                    const likeContainer = document.createElement('div');
                    likeContainer.classList.add('like-container');

                    // Création de l'élément affichant le nombre de likes
                    const likeCount = document.createElement('span');
                    likeCount.classList.add('like-count');
                    likeCount.innerText = media.likes.toString();

                    // Création de l'icône de like
                    const likeIcon = document.createElement('span');
                    likeIcon.classList.add('like-icon');
                    likeIcon.innerText = '❤️';

                    // Ajout du nombre de likes et de l'icône au conteneur des likes
                    likeContainer.appendChild(likeCount);
                    likeContainer.appendChild(likeIcon);

                    // Ajout du conteneur du titre et du conteneur des likes au conteneur d'informations
                    infoContainer.appendChild(titleContainer);
                    infoContainer.appendChild(likeContainer);

                    // Ajout du conteneur d'informations au conteneur principal
                    container.appendChild(infoContainer);

                    // Ajout du conteneur principal à la galerie
                    galerie.appendChild(container);

                    // Gestion des clics sur l'icône de like
                    let liked = false;
                    likeContainer.addEventListener('click', () => {
                        if (!liked) {
                            media.likes++;
                            likeCount.innerText = media.likes.toString();
                            liked = true;
                        }
                    });

                    // Ajout des informations du média au tableau
                    images.push({ src: media.file, likes: media.likes });
                }
            });

            // Gestion des clics sur les images dans la galerie
            const imagesInGallery = document.querySelectorAll('.gallery-img');
            imagesInGallery.forEach((image, index) => {
                image.addEventListener('click', () => {
                    openLightbox(images[index].src, images);
                    currentImageIndex = index;
                });
            });

        } catch (error) {
            // Gestion des erreurs lors de la requête fetch
            console.error("Erreur lors de la requête fetch :", error);
        }
    }

    // Sélection des éléments du formulaire de contact dans le DOM
    const openModal = document.querySelector('.contact_button');
    const modal = document.querySelector('.modal');
    const envoiForm = document.querySelector('.envoiForm');

    // Ajout d'un gestionnaire d'événement pour ouvrir la modal
    openModal.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Sélection des éléments du formulaire dans le DOM
    const prenom = document.querySelector("#prenom");
    const nom = document.querySelector("#nom");
    const email = document.querySelector("#email");
    const msg = document.querySelector("#msg");
    const form = document.querySelector('#formulaire');

    // Ajout d'un gestionnaire d'événement pour soumettre le formulaire
    form.addEventListener('submit', finForm);

    // Fonction appelée lors de la soumission du formulaire
    function finForm(e) {
        // Empêcher le comportement par défaut du formulaire
        e.preventDefault();
        // Afficher les informations du formulaire dans la console
        console.log(`
        Prénom : ${prenom.value}
        Nom : ${nom.value}
        Email : ${email.value}
        Message : ${msg.value}`);
        // Cacher la modal après la soumission du formulaire
        modal.style.display = 'none';
    }

    // Appel de la fonction pour charger les médias lors du chargement de la page
    window.onload = chargerMedias;
});
