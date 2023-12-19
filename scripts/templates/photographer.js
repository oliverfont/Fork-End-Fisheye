function photographerTemplate(data) {
    const { id, name, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/PhotographersID/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const a = document.createElement('a');
        a.setAttribute('href', `photographer.html?id=${id}&name=${name}&location=${city}&picture=${picture}&tagline=${tagline}`);

        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `Portrait de ${name} dont la devise est de "${tagline}"`)

        const h2 = document.createElement('h2');
        h2.textContent = name;

        const pId = document.createElement('p');
        pId.textContent = `ID: ${id}`;

        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;

        const pLocation = document.createElement('p');
        pLocation.textContent = `${city}, ${country}`;
        pLocation.setAttribute('class', "location")

        const pPrice = document.createElement('p');
        pPrice.textContent = `${price}/jour`;
        pPrice.setAttribute('class', "price")
        
        article.appendChild(a)
        a.appendChild(img);
        a.appendChild(h2);
        a.appendChild(pLocation);
        a.appendChild(pTagline);
        a.appendChild(pPrice);


        return article;
    }

    return { id, name, picture, getUserCardDOM };
};