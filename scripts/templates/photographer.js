function photographerTemplate(data) {
    const { id, name, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/PhotographersID/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.setAttribute('src', picture);

        const h2 = document.createElement('h2');
        h2.textContent = name;

        const pId = document.createElement('p');
        pId.textContent = `ID: ${id}`;

        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;

        const pLocation = document.createElement('p');
        pLocation.textContent = `${city}, ${country}`;

        const pPrice = document.createElement('p');
        pPrice.textContent = `Starting at $${price}`;

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(pId);
        article.appendChild(pTagline);
        article.appendChild(pLocation);
        article.appendChild(pPrice);

        return article;
    }

    return { id, name, picture, getUserCardDOM };
}