
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    console.log(works)
    return works
}


function displayWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;
        // On rattache la balise figure a la section Projets
        sectionGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);
    }
}


async function init() {
    // on veut récupérer la liste des works
    const works = await loadWorks()
    // on veut afficher la liste des works dans la page
    displayWorks(works)
}

init()


