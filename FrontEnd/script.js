
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
    const FilterButtons = document.querySelectorAll(".filters-btn__container button");
    // On met un listener sur chaque bouton
    FilterButtons.forEach(button => {
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
        const modeEdition = document.querySelector(".mode-edition");
        modeEdition.classList.add("mode-edition-css");
        const iconeElement = document.createElement("i");
        iconeElement.classList.add("fa-regular", "fa-pen-to-square");
        const textElement = document.createElement("p");
        textElement.innerHTML = "Mode édition";
        const buttonElement = document.createElement("button");
        buttonElement.innerText = "Publier les changements";
        modeEdition.appendChild(iconeElement);
        modeEdition.appendChild(textElement);
        modeEdition.appendChild(buttonElement);

        const photoEdition = document.querySelector(".modif");
        const iconePhotoElement = document.createElement ("i");
        iconePhotoElement.classList.add("fa-regular", "fa-pen-to-square")
        const textPhotoElement = document.createElement("p");
        textPhotoElement.innerText = "modifier";
        photoEdition.appendChild(iconePhotoElement);
        photoEdition.appendChild(textPhotoElement);

        const portfolioEdition = document.querySelector(".portfolio__title");
        const iconePortfolioElement = document.createElement ("i");
        iconePortfolioElement.classList.add("fa-regular", "fa-pen-to-square")
        const textPortfolioElement = document.createElement("p");
        textPortfolioElement.innerText = "modifier";
        portfolioEdition.appendChild(iconePortfolioElement);
        portfolioEdition.appendChild(textPortfolioElement);

        const buttonContainerEdition = document.querySelector(".filters-btn__container");
        buttonContainerEdition.classList.add("buttonHide");
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


