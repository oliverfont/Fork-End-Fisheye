async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");
  
    photographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      const userCardDOM = photographerModel.getUserCardDOM();
      photographersSection.appendChild(userCardDOM);
    });
  }
  
  async function init() {
    try {
      // Récupère les données des photographes
      const response = await fetch("/data/photographers.json");
      const data = await response.json();
      const photographers = data.photographers;
  
      console.log(photographers);
      displayData(photographers);
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
    }
  }
  
  init();