// photographerInfo.js
export function displayPhotographerInfo(photographerName, photographerLocation, photographerTagline, photographerPhoto, photographerPrice) {
    const photograpHeader = document.querySelector('.photograph-header');

    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');

    const locationElement = document.createElement('p');
    locationElement.classList.add('location');

    const taglineElement = document.createElement('p');
    taglineElement.classList.add('tagline');

    const photoElement = document.createElement('img');
    photoElement.classList.add('photo');
    photoElement.alt = `Portrait of ${photographerName}`;

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

    const asideInfo = document.querySelector('aside');
    const prixInfo = document.createElement('p');
    prixInfo.innerHTML = `${photographerPrice}€ / jour`;
    asideInfo.appendChild(prixInfo);
}
