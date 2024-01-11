async function getPhotographers() {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    console.log("Photographers data:", data.photographers);
    return { photographers: data.photographers };
}

async function getMedia() {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    console.log("Media data:", data.media);
    return { media: data.media };
}

async function displayData(photographers, media) {
    const photographersSection = document.querySelector(".photographer_section");
    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);

        // Filtrer les médias du photographe actuel
        const photographerMedia = media.filter((m) => m.photographerId === photographer.id);

        // Ajouter les informations sur les médias du photographe
        photographerModel.setMedia(photographerMedia);

        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupérer les données des photographes
    const { photographers } = await getPhotographers();

    // Récupérer les données des médias
    const { media } = await getMedia();

    // Afficher les données
    displayData(photographers, media);
}

init();
