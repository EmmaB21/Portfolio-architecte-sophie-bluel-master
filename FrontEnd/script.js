
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

function filterWorks(works) {
    // BOUTONS
    // On supprime les doublons de catégories en passant par Set
    let categoryName = new Set(works.map(works => works.category.name))
    let category = [...new Set(categoryName)]
    // On ajoute une catégorie "tous" au début du tableau
    category.unshift("Tous");
    console.log(category);
    // On crée les boutons de filtres
    for (i = 0; i < category.length; i++) {
        const buttonContainer = document.querySelector(".filters-btn__container")
        const buttonElement = document.createElement("button")
        buttonElement.innerText = category[i];
        buttonContainer.appendChild(buttonElement);
    }
}


async function init() {
    // on veut récupérer la liste des works
    const works = await loadWorks()
    // on veut afficher la liste des works dans la page
    displayWorks(works)
    // on veut filtrer les travaux
    filterWorks(works)
}

init()

