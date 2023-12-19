document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerName = urlParams.get('name');
    const photographerLocation = urlParams.get('location');
    const photographerTagline = urlParams.get('tagline');
    const photographerPhoto = urlParams.get('picture');
  
// Créer les éléments nécessaires
    const photograpHeader = document.querySelector('.photograph-header')
    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');
  
    const locationElement = document.createElement('p');
    locationElement.classList.add('location');
  
    const taglineElement = document.createElement('p');
    taglineElement.classList.add('tagline');
  
    const photoElement = document.createElement('img');
    photoElement.classList.add('photo');
  
    // Ajouter les éléments au DOM (par exemple, au parent avec l'ID 'main')
    photograpHeader.appendChild(nameElement);
    photograpHeader.appendChild(locationElement);
    photograpHeader.appendChild(taglineElement);
    photograpHeader.appendChild(photoElement);
  
    // Mettre à jour le contenu des éléments
    nameElement.innerText = photographerName;
    locationElement.innerText = photographerLocation;
    taglineElement.innerText = photographerTagline;
  
    // Mettre à jour la source de l'image
    photoElement.src = photographerPhoto;
  
    // Vous pouvez également ajouter des classes ou des styles supplémentaires ici si nécessaire
  });
  