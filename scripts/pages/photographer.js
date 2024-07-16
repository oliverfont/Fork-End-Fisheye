document.addEventListener('DOMContentLoaded', async function () {
    let lightboxIsOpen = false;
    let images = [];
    let currentMediaIndex = 0; // Déclarez currentMediaIndex en dehors de toute fonction

    function openLightbox(mediaUrl, mediaList, isVideo = false) {
        const lightbox = document.getElementById('customLightbox');
        const lightboxMedia = document.getElementById('lightboxContent');

        if (!lightboxMedia) {
            console.error("L'élément lightboxMedia n'a pas été trouvé.");
            return;
        }

        images = mediaList || [];
        currentMediaIndex = images.findIndex(media => media.src === mediaUrl);

        if (currentMediaIndex === -1) {
            console.error("Index de média introuvable. Utilisation du premier média.");
            currentMediaIndex = 0;
        }

        // Supprimez l'élément existant de la lightbox
        lightboxMedia.innerHTML = '';

        if (isVideo) {
            // Si c'est une vidéo, créez un lecteur vidéo directement dans la lightbox
            const videoElement = createVideoElement(mediaUrl);
            lightboxMedia.appendChild(videoElement);
        } else {
            // Si c'est une image, créez un élément image
            const imageElement = createImageElement(mediaUrl);
            lightboxMedia.appendChild(imageElement);

            // Ajout du titre sous l'image
            const titleElement = document.createElement('p');
            titleElement.classList.add('lightbox-title');
            titleElement.innerText = images[currentMediaIndex].title;
            lightboxMedia.appendChild(titleElement);
        }

        lightbox.style.display = 'flex';
        lightboxIsOpen = true;
        const nextBtn = document.querySelector('.next');
        nextBtn.tabIndex = 0;
        const prevBtn = document.querySelector('.prev');
        prevBtn.tabIndex = 0;
        const closeBtn = document.querySelector('.close');
        closeBtn.tabIndex = 0;
        closeBtn.addEventListener('click', closeLightbox);
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('aria-label', 'Close lightbox');
        closeBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                closeLightbox();
            }
        });

        window.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        // Déplacez le focus vers la lightbox pour une meilleure navigation au clavier
        lightbox.focus();
    }

    // Ajout des fonctions de création d'éléments
    function createImageElement(imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.classList.add('lightbox-media');
        imageElement.src = imageUrl;
        imageElement.alt = 'Image in lightbox';
        return imageElement;
    }

    function createVideoElement(videoUrl) {
        const videoElement = document.createElement('video');
        videoElement.classList.add('lightbox-media');
        videoElement.controls = true;
        videoElement.autoplay = true; // Autoplay pour que la vidéo démarre immédiatement

        const sourceElement = document.createElement('source');
        sourceElement.src = videoUrl;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);

        return videoElement;
    }

    function navigateLightbox(direction) {
        currentMediaIndex = (currentMediaIndex + direction + images.length) % images.length;

        if (currentMediaIndex >= 0 && currentMediaIndex < images.length) {
            const newMedia = images[currentMediaIndex];
            const newMediaUrl = newMedia.src;
            const newMediaIsVideo = newMedia.isVideo;

            // Vérifiez si le nouveau média est une vidéo ou une image, puis ouvrez la lightbox en conséquence
            openLightbox(newMediaUrl, images, newMediaIsVideo);
        }
    }

    function closeLightbox() {
        const lightbox = document.getElementById('customLightbox');
        lightbox.style.display = 'none';
        lightboxIsOpen = false;
    }

    // Écouteur d'événements pour les touches du clavier
    window.addEventListener('keydown', (event) => {
        if (lightboxIsOpen) {
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowRight') {
                navigateLightbox(1);
            } else if (event.key === 'ArrowLeft') {
                navigateLightbox(-1);
            }
        }
    });

    // Ajout d'écouteurs d'événements pour les boutons next et prev
    document.querySelector('.next').addEventListener('click', () => {
        navigateLightbox(1);
    });

    document.querySelector('.prev').addEventListener('click', () => {
        navigateLightbox(-1);
    });

    document.querySelector('.next').addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            navigateLightbox(1);
        }
    });

    document.querySelector('.prev').addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            navigateLightbox(-1);
        }
    });

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
            linkElement.tabIndex = 0;
            linkElement.setAttribute('title', `Voir le média: ${this.title}`);
        
            if (this.isVideo()) {
                // Si c'est une vidéo, créez une miniature pour la galerie
                const thumbnailSrc = await this.createVideoThumbnail();
                const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
                linkElement.appendChild(thumbnailImageElement);
                linkElement.setAttribute('aria-label', `Video: ${this.title}`);
            } else {
                // Si ce n'est pas une vidéo, créez un élément image normal pour la galerie
                const imageElement = this.createImageElement();
                linkElement.appendChild(imageElement);
                linkElement.setAttribute('aria-label', `Image: ${this.title}`);
            }
        
            // Fonction pour afficher l'infobulle
            const showTooltip = (element) => {
                const tooltipText = element.getAttribute('title');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = tooltipText;
                document.body.appendChild(tooltip);
        
                const rect = element.getBoundingClientRect();
                tooltip.style.position = 'absolute';
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        
                element.addEventListener('blur', () => {
                    document.body.removeChild(tooltip);
                }, { once: true });
            };
        
            linkElement.addEventListener('focus', () => showTooltip(linkElement));
        
            linkElement.addEventListener('keydown', async (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (this.isVideo()) {
                        openLightbox(this.file, images, true);
                    } else {
                        openLightbox(this.file, images);
                    }
                }
            });
        
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
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL();
        }

        createImageElement() {
            const imageElement = new Image();
            imageElement.classList.add('gallery-media', 'gallery-img');
            imageElement.src = this.file;
            imageElement.alt = this.title;
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
        createMedia(file, likes, thumbnail, title, date) {
            return new Media(file, likes, thumbnail, title, date);
        }
    }

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
    photoElement.alt = `Portrait of ${photographerName}`;

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
            let likesA = parseInt(a.querySelector('.like-count').innerText);
            let likesB = parseInt(b.querySelector('.like-count').innerText);

            switch (orderBy) {
                case 'popularite':
                    return likesB - likesA; // Trie du plus liké au moins liké
                case 'date':
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    // Trie par date chronologique, du plus récent au plus ancien
                    return dateB - dateA;
                case 'titre':
                    const titleA = a.querySelector('.media-title').innerText.toLowerCase();
                    const titleB = b.querySelector('.media-title').innerText.toLowerCase();
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });

        // Ajoutez les containers triés à la galerie
        containers.forEach(container => galerie.appendChild(container));

        // Mettre à jour l'ordre des images dans le tableau 'images'
        containers.forEach(container => {
            const mediaElement = container.querySelector('a');
            const isVideo = container.querySelector('video') !== null;

            // Vérifiez si le container est déjà dans la galerie
            const isInGallery = galerie.contains(container);
            if (isInGallery) {
                return; // Ignorer l'ajout du container déjà présent dans la galerie
            }

            const updatedContainer = container.cloneNode(true);
            galerie.appendChild(updatedContainer);

            if (isVideo) {
                const videoElement = updatedContainer.querySelector('video');
                const sourceElement = document.createElement('source');
                sourceElement.src = mediaElement.href;
                sourceElement.type = 'video/mp4';
                videoElement.appendChild(sourceElement);
            } else {
                const imgElement = updatedContainer.querySelector('img');
                imgElement.src = mediaElement.href;
            }
        });

        return containers;
    }

    // Écouteur d'événement pour le changement d'option de tri
    document.getElementById('tri').addEventListener('change', function () {
        const triOption = this.value;
        // Appelez la fonction pour trier la galerie avec l'option choisie
        updateGalleryOrder(triOption);
    });

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

    const cheminDossierImages = `/assets/photographers/Photos/${photographerName.split(' ')[0]}/`;
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
            images = []; // Remettre à zéro les images ici

            for (let mediaData of mediaArray) {
                if (mediaData.photographerId === photographerId) {
                    // Convertissez la chaîne de date en objet Date
                    const dateParts = mediaData.date.split('-');
                    const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

                    const media = new Media(
                        `${cheminDossierImages}/${mediaData.video || mediaData.image}`,
                        mediaData.likes,
                        `${cheminDossierImages}/${mediaData.thumbnail}`,
                        mediaData.title,
                        formattedDate
                    );

                    const container = document.createElement('article');
                    container.classList.add('photo-container');
                    container.setAttribute('data-date', formattedDate.toISOString()); // Stocker la date dans l'attribut de données

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
                            openLightbox(videoUrl, images, true);
                            currentMediaIndex = images.findIndex(media => media.src === videoUrl);
                        } else {
                            // Si c'est une image, ouvre la lightbox avec l'image
                            openLightbox(media.file, images);
                            currentMediaIndex = images.findIndex(media => media.src === media.file);
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
                    
                    // Fonction pour afficher l'infobulle
                    const showTooltip = (element) => {
                        const tooltipText = element.getAttribute('title');
                        const tooltip = document.createElement('div');
                        tooltip.className = 'tooltip';
                        tooltip.innerText = tooltipText;
                        document.body.appendChild(tooltip);
                    
                        const rect = element.getBoundingClientRect();
                        tooltip.style.position = 'absolute';
                        tooltip.style.left = `${rect.left + window.scrollX}px`;
                        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
                    
                        element.addEventListener('blur', () => {
                            document.body.removeChild(tooltip);
                        }, { once: true });
                    };
                    
                    likeIcon.addEventListener('focus', () => showTooltip(likeIcon));
                    
                    let liked = false;
                    const toggleLike = () => {
                        if (liked) {
                            media.likes--;
                            totalLikes--;
                            likeIcon.style.color = '#901C1C';  // Réinitialise la couleur à la valeur par défaut
                        } else {
                            media.likes++;
                            totalLikes++;
                            likeIcon.style.color = '#FF0000';  // Définit la couleur à rouge (#FF0000)
                        }
                        likeCount.innerText = media.likes.toString();
                        totalLikeInfo.innerHTML = `${totalLikes} ♥`;
                    
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

                    galerie.appendChild(container);

                    likeIcon.style.color = '#901C1C';  // Définit la couleur à rouge (#FF0000)

                    images.push({ src: media.file, likes: media.likes, title: media.title, date: media.date, isVideo: media.isVideo() });
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

    window.onload = chargerMedias;
});
