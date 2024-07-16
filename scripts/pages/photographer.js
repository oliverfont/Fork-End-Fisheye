// photographer.js
import { openLightbox, closeLightbox, navigateLightbox } from './lightbox.js';
import { Media, MediaFactory } from './media.js';
import { chargerMedias, trierGalerie, getImages } from './gallery.js';

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');
    const photographerPrice = urlParams.get('price');

    // Afficher les informations du photographe
    displayPhotographerInfo(photographerName, photographerLocation, photographerTagline, photographerPhoto, photographerPrice);

    const photographersResponse = await fetch("/data/photographers.json");
    const photographersData = await photographersResponse.json();
    const photographer = photographersData.photographers.find(p => p.name === photographerName);
    if (photographer) {
        const cheminDossierImages = `/assets/photographers/Photos/${photographerName.split(' ')[0]}`;
        await chargerMedias(photographer.id, cheminDossierImages);

        let images = getImages(); // Récupérer les images après le chargement

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
    }

    document.getElementById('tri').addEventListener('change', function () {
        const triOption = this.value;
        trierGalerie(triOption);
    });

    // Ajout d'infobulles pour les éléments navigables
    const navigableElements = document.querySelectorAll('a, button, span');
    navigableElements.forEach(element => {
        element.addEventListener('focus', () => showTooltip(element));
    });
});

function displayPhotographerInfo(name, location, tagline, photo, price) {
    const photograpHeader = document.querySelector('.photograph-header');
    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');

    const locationElement = document.createElement('p');
    locationElement.classList.add('location');

    const taglineElement = document.createElement('p');
    taglineElement.classList.add('tagline');

    const photoElement = document.createElement('img');
    photoElement.classList.add('photo');
    photoElement.alt = `Portrait of ${name}`;

    const infoContainer = document.createElement('div');
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);
    photograpHeader.appendChild(infoContainer);
    photograpHeader.appendChild(photoElement);

    nameElement.innerText = name;
    locationElement.innerText = location;
    taglineElement.innerText = tagline;
    photoElement.src = photo;
}

// Fonction pour afficher l'infobulle
function showTooltip(element) {
    const tooltipText = element.getAttribute('title') || element.innerText;
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
}
