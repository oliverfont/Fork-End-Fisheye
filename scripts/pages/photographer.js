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
      constructor(file, likes) {
        this.file = file;
        this.likes = likes;
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
      
        // Créer une miniature pour la vidéo en utilisant la première image
        this.createVideoThumbnail().then(thumbnailSrc => {
          const thumbnailImageElement = this.createThumbnailImageElement(thumbnailSrc);
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
      createMedia(file, likes) {
        return new Media(file, likes);
      }
    }
  
    const firstPartOfName = photographerName.split(' ')[0];
    const cheminDossierImages = new URL(`/assets/photographers/Photos/${firstPartOfName}/`, window.location.href);
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
  
        mediaArray.forEach((mediaData, index) => {
          if (mediaData.photographerId === photographerId) {
            const media = mediaFactory.createMedia(
              `${cheminDossierImages}/${mediaData.image}`,
              mediaData.likes
            );
  
            const container = document.createElement('div');
            container.classList.add('photo-container');
  
            // Ajout du titre sous chaque image
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
  
            // Ajout des éléments pour les likes et le titre
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
  
            // Événement pour incrémenter le nombre de likes lors du clic
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
  