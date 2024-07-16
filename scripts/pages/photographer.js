// photographer.js
import { openLightbox, closeLightbox, navigateLightbox } from './lightbox.js';
import { Media, MediaFactory } from './media.js';
import { displayPhotographerInfo } from './photographerInfo.js';
import { chargerMedias, trierGalerie } from './gallery.js';

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');
    const photographerPrice = urlParams.get('price');

    displayPhotographerInfo(photographerName, photographerLocation, photographerTagline, photographerPhoto, photographerPrice);

    const photographersResponse = await fetch("/data/photographers.json");
    const photographersData = await photographersResponse.json();
    const photographer = photographersData.photographers.find(p => p.name === photographerName);
    if (photographer) {
        const cheminDossierImages = `/assets/photographers/Photos/${photographerName.split(' ')[0]}`;
        await chargerMedias(photographer.id, cheminDossierImages);
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
