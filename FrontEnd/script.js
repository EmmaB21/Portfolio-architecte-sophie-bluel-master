
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
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
    // On crée les boutons de filtres
    for (i = 0; i < category.length; i++) {
        const buttonContainer = document.querySelector(".filters-btn__container")
        const buttonElement = document.createElement("button")
        buttonElement.innerText = category[i];
        buttonContainer.appendChild(buttonElement);
    }
    // FILTRES
    // On sélectionne les boutons de filtre
    const filterButtons = document.querySelectorAll(".filters-btn__container button");
    // On met un listener sur chaque bouton
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // On met à jour l'affichage
            document.querySelector(".gallery").innerHTML = '';
            // On filtre les projets par le nom de la catégorie
            let filteredWorks = works.filter((worksName) => {
                return worksName.category.name == button.textContent || button.textContent == "Tous"
            })
            // On affiche les projets filtrés
            displayWorks(filteredWorks);
        })
    });
}

function setModification(nameObjectHtml, textHtml, AddButton) {
    const Element = document.querySelector(nameObjectHtml);
    const icone = document.createElement("i");
    const text = document.createElement("p");

    icone.classList.add("fa-regular", "fa-pen-to-square");
    text.innerText = textHtml;

    Element.appendChild(icone);
    Element.appendChild(text);

    if (AddButton) {
        Element.classList.add("mode-edition-css");
        const buttonElement = document.createElement("button");
        buttonElement.innerText = "Publier les changements";
        Element.appendChild(buttonElement);
    }
}

function logged() {
    // On récupère le token
    const loginLink = document.querySelector(".login__link");
    let token = localStorage.getItem("token")
    const isLogged = token ? true : false;
    console.log(isLogged);
    // On modifie l'affichage du lien login
    (isLogged) ? loginLink.innerHTML = "logout" : "login";
    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
    })
    // On modifie l'affichage du mode édition
    if (isLogged) {
        setModification(".mode-edition", "Mode édition", true)
        setModification(".modif", "modifier", false)
        setModification(".portfolio__title", "modifier", false)

        const buttonContainerEdition = document.querySelector(".filters-btn__container");
        buttonContainerEdition.classList.add("filter-buttons--hide");
    }
}

async function init() {
    // on veut récupérer la liste des works
    const works = await loadWorks()
    // on veut afficher la liste des works dans la page
    displayWorks(works)
    // on veut filtrer les travaux
    filterWorks(works)
    // on modifie la page après identification
    logged()
}

init()


