// Import des fonctions nécessaires dans les différents modules
import { openLightbox, closeLightbox, navigateLightbox } from './lightbox.js';
import { Media, MediaFactory } from './media.js';
import { chargerMedias, trierGalerie, getImages } from './gallery.js';

// Déclaration de la variable pour suivre l'index du média actuel
let currentMediaIndex = 0;

// Ajout d'un écouteur d'événements pour exécuter le code lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', async function () {
    // Récupération des paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');
    const photographerPrice = urlParams.get('price');

    // Affichage des informations du photographe
    displayPhotographerInfo(photographerName, photographerLocation, photographerTagline, photographerPhoto, photographerPrice);

    // Récupération des données des photographes à partir du fichier JSON
    const photographersResponse = await fetch("/data/photographers.json");
    const photographersData = await photographersResponse.json();

    // Recherche du photographe correspondant au nom dans les données récupérées
    const photographer = photographersData.photographers.find(p => p.name === photographerName);
    if (photographer) {
        // Détermination du chemin des images du photographe
        const cheminDossierImages = `/assets/photographers/Photos/${photographerName.split(' ')[0]}`;

        // Chargement des médias du photographe
        await chargerMedias(photographer.id, cheminDossierImages);

        // Récupération des images après le chargement
        let images = getImages();

        // Calcul du nombre total de likes
        let totalLikes = images.reduce((total, media) => total + media.likes, 0);

        // Affichage des informations dans l'aside
        const asideInfo = document.querySelector('aside');
        const prixInfo = document.createElement('p');
        const totalLikeInfo = document.createElement('p');
        totalLikeInfo.classList.add('total-likes');

        prixInfo.innerHTML = `${photographerPrice}€ / jour`;
        totalLikeInfo.innerHTML = `${totalLikes} ♥`;

        asideInfo.appendChild(totalLikeInfo);
        asideInfo.appendChild(prixInfo);

        // Écouteur d'événements pour ouvrir la lightbox lorsque l'image est cliquée
        const imagesInGallery = document.querySelectorAll('.gallery-img');
        imagesInGallery.forEach((image, index) => {
            image.addEventListener('click', () => {
                openLightbox(images[index].src, images);
                currentMediaIndex = index;
            });
        });
    }

    // Écouteur d'événements pour trier la galerie lorsque l'option de tri change
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

// Fonction pour afficher les informations du photographe
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
