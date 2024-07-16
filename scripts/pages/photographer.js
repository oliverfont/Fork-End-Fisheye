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
        chargerMedias(photographer.id, cheminDossierImages);
    }

    document.getElementById('tri').addEventListener('change', function () {
        const triOption = this.value;
        trierGalerie(triOption, images);
    });
});
