async function getPhotographers() {
    const response = await fetch("/data/photographers.json");
    const data = await response.json();
    console.log("Photographers data:", data.photographers);
    return { photographers: data.photographers };
};

async function displayData(photographers, media) {
    const photographersSection = document.querySelector(".photographer_section");
  
    photographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      const userCardDOM = photographerModel.getUserCardDOM();
      photographersSection.appendChild(userCardDOM);
  
      // Afficher les informations sur les médias
      const mediaContainer = document.createElement('div');
      mediaContainer.classList.add('media-container');
  
      const photographerMedia = media.filter((m) => m.photographerId === photographer.id);
  
      photographerMedia.forEach((media) => {
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media');
        mediaElement.innerHTML = `
          <p>${media.title}</p>
          <p>Likes: ${media.likes}</p>
        `;
        mediaContainer.appendChild(mediaElement);
      });
      });
  }
  

  async function init() {
    // Récupère les datas des photographes
    const photographersResponse = await fetch("/data/photographers.json");
    const photographersData = await photographersResponse.json();
    const photographers = photographersData.photographers;
  
    // Récupère les datas des médias
    const mediaResponse = await fetch("/data/photographers.json");
    const mediaData = await mediaResponse.json();
    const media = mediaData.media;
  
    displayData(photographers, media);
  }
  
  init();