function photographerTemplate(data) {
  const { id, name, city, country, tagline, price, portrait } = data;

  const picture = `assets/photographers/PhotographersID/${portrait}`;

  function getUserCardDOM() {
      const article = document.createElement('article');
      
      const a = document.createElement('a');
      a.setAttribute('href', `photographer.html?id=${id}&name=${name}&location=${city}&picture=${picture}&tagline=${tagline}&price=${price}`);
      a.setAttribute('title', `Voir le profil de ${name}`);

      const img = document.createElement('img');
      img.setAttribute('src', picture);
      img.setAttribute('alt', `Portrait de ${name} dont la devise est "${tagline}"`);
      img.setAttribute('title', `Portrait de ${name}`);

      const h2 = document.createElement('h2');
      h2.textContent = name;
      h2.setAttribute('title', `Nom: ${name}`);

      const pId = document.createElement('p');
      pId.textContent = `ID: ${id}`;
      pId.setAttribute('title', `Identifiant du photographe: ${id}`);

      const pTagline = document.createElement('p');
      pTagline.textContent = tagline;
      pTagline.setAttribute('title', `Devise: ${tagline}`);

      const pLocation = document.createElement('p');
      pLocation.textContent = `${city}, ${country}`;
      pLocation.setAttribute('class', 'location');
      pLocation.setAttribute('title', `Localisation: ${city}, ${country}`);

      const pPrice = document.createElement('p');
      pPrice.textContent = `${price}€/jour`;
      pPrice.setAttribute('class', 'price');
      pPrice.setAttribute('title', `Tarif: ${price}€ par jour`);

      // Fonction pour afficher l'infobulle
      const showTooltip = (element) => {
          const tooltipText = element.getAttribute('title');
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
      };

      // Ajout des événements pour afficher les infobulles lors du focus
      [a, img, h2, pId, pTagline, pLocation, pPrice].forEach(element => {
          element.addEventListener('focus', () => showTooltip(element));
      });

      article.appendChild(a);
      a.appendChild(img);
      a.appendChild(h2);
      article.appendChild(pLocation);
      article.appendChild(pTagline);
      article.appendChild(pPrice);

      return article;
  }

  return { id, name, picture, getUserCardDOM };
}
