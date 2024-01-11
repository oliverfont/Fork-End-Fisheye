class MediaFactory {
    createMedia(file) {
        return new Media(file);
    }
}

const photographerName = urlParams.get('name');
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
            const clickableImage = media.createClickableImageElement();

            clickableImage.addEventListener('click', (event) => {
                event.preventDefault();
                const mediaUrl = media.file;
                openLightbox(mediaUrl, images);
                currentImageIndex = index;
            });

            galerie.appendChild(clickableImage);

            images.push({ src: media.file });
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
