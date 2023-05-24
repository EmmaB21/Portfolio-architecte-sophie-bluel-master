
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    return works
}

function displayWorks(works) {
    // On met à jour l'affichage
    document.querySelector(".gallery").innerHTML = '';
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

// fonction de modification de l'affichage en Mode Edition
function setModification(classObjectHtml, textHtml) {
    // on récupère et on crée les éléments à modifier
    const Element = document.querySelector(classObjectHtml);
    const icone = document.createElement("i");
    const text = document.createElement("p");

    icone.classList.add("fa-regular", "fa-pen-to-square");
    text.innerText = textHtml;

    Element.appendChild(icone);
    Element.appendChild(text);

    // on personnalise l'élément à modifier
    if (classObjectHtml == ".mode-edition") {
        Element.classList.add("mode-edition-css");
        const buttonElement = document.createElement("button");
        buttonElement.innerText = "Publier les changements";
        Element.appendChild(buttonElement);
    }
    else if (classObjectHtml == ".portfolio__title") {
        text.classList.add("modalLink")
    }
}

function logged() {
    // On récupère le token
    const loginLink = document.querySelector(".login__link");
    let token = localStorage.getItem("token")
    console.log(token)
    const isLogged = token ? true : false;
    console.log(isLogged);
    // On modifie l'affichage du lien login
    (isLogged) ? loginLink.innerHTML = "logout" : "login";
    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
    })
    // On modifie l'affichage du mode édition
    if (isLogged) {
        setModification(".mode-edition", "Mode édition")
        setModification(".modif", "modifier")
        setModification(".portfolio__title", "modifier")

        const buttonContainerEdition = document.querySelector(".filters-btn__container");
        buttonContainerEdition.classList.add("filter-buttons--hide");
    }
}

function openModal() {
    // on récupère le lien d'ouverture de la modale
    const openModalLink = document.querySelector(".modalLink");
    // au clic, on affiche la modale en supprimant la classe css contenant le display:none
    openModalLink.addEventListener("click", () => {
        const displayModal = document.querySelector(".modal");
        displayModal.classList.remove("modalHide");
        // on met en place les modalités de fermeture de la modale
        displayModal.addEventListener("click", closeModal);
        const closeModalLink = document.querySelector(".fa-xmark");
        closeModalLink.addEventListener("click", closeModal);
        displayModal.querySelector(".modal-wrapper").addEventListener("click", (e => e.stopPropagation()));
    });
}

function closeModal() {
    // on ferme la modale en remettant la classe css contenant le display:none
    const hideModal = document.querySelector(".modal");
    hideModal.classList.add("modalHide");
};

function displayWorksInModal(works) {

    // on affiche les travaux dans la modale (cf displayWorks)
    for (let i = 0; i < works.length; i++) {
        const photo = works[i]
        const photoContainer = document.querySelector(".photo-ctn");
        const photoElement = document.createElement("div");
        photoElement.classList.add("workDiv")
        const imagePhoto = document.createElement("img");
        imagePhoto.src = photo.imageUrl;
        photoContainer.appendChild(photoElement);
        photoElement.appendChild(imagePhoto);

        // fonctions de création et de fonctionnement des options d'affichage
        moveWorks(photoElement)
        deleteWorks(photo, photoElement)
        editWorks(photoElement)
    }
}

function moveWorks(photoElement) {
    // On ajoute l'icône de déplacement
    const iconeMovePhoto = document.createElement("i");
    iconeMovePhoto.classList.add("fa-solid", "fa-up-down-left-right");
    photoElement.appendChild(iconeMovePhoto);
}

function deleteWorks(works, photoElement) {
    // On ajoute l'icône de suppression
    const iconeTrashPhoto = document.createElement("i");
    iconeTrashPhoto.classList.add("fa-solid", "fa-trash-can");
    photoElement.appendChild(iconeTrashPhoto);
    // On supprime le projet au clic sur l'icône
    iconeTrashPhoto.addEventListener("click", async () => {
        const error = document.querySelector(".error")
        const token = JSON.parse(localStorage.getItem("token"));
        let id = works.id;
        console.log(id)
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${token.token}`
            }
        })
        if (response.ok) {
            // On met l'affichage à jour
            document.querySelector(".photo-ctn").innerHTML = "";
            const works = await loadWorks();
            displayWorksInModal(works);
            displayWorks(works);
        }
        else error.textContent = "Erreur. Veuillez essayer de vous reconnecter"
    })
}

function editWorks(photoElement) {
    // On ajoute une option d'édition
    const textPhoto = document.createElement("p");
    textPhoto.innerText = "éditer";
    photoElement.appendChild(textPhoto);
}

function openAddWorks() {
    const addButton = document.querySelector(".addButton");
    // au clic, on crée la modale d'ajout de projet
    addButton.addEventListener("click", () => {
        const modalWrapper = document.querySelector(".modal-wrapper");
        modalWrapper.innerHTML = "";
        createNewModal(modalWrapper)
    })
}

function createModal() {
    const modalWrapper = document.querySelector(".modal-wrapper")
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.textContent = "Galerie photo";
    const modalTextError = document.createElement("p");
    modalTextError.classList.add("error");
    const modalPhotoCtn = document.createElement("div");
    modalPhotoCtn.classList.add("photo-ctn");
    const modalBorder = document.createElement("div");
    modalBorder.classList.add("border");
    const modalAddButton = document.createElement("button");
    modalAddButton.classList.add("addButton")
    modalAddButton.textContent = "Ajouter une photo"
    const modalRemoveButton = document.createElement("button");
    modalRemoveButton.classList.add("removeButton");
    modalRemoveButton.textContent = "Supprimer la galerie"

    // modal.appendChild(modalWrapper);
    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalAddTitle);
    modalWrapper.appendChild(modalPhotoCtn);
    modalWrapper.appendChild(modalTextError);
    modalWrapper.appendChild(modalBorder);
    modalWrapper.appendChild(modalAddButton);
    modalWrapper.appendChild(modalRemoveButton);

    openAddWorks()
}

function createNewModal(modalWrapper) {
    const iconeBack = document.createElement("i");
    iconeBack.classList.add("fa-solid", "fa-arrow-left");
    iconeBack.addEventListener("click", async () => {
        modalWrapper.innerHTML = ""
        createModal()
        const works = await loadWorks()
        displayWorksInModal(works)
    })
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.textContent = "Ajout photo";

    modalWrapper.appendChild(iconeBack);
    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalAddTitle);

    createForm(modalWrapper)
}

function createForm(modalWrapper) {
    const addForm = document.createElement("form");
    addForm.classList.add("addForm");
    const addBox = document.createElement("div");
    addBox.classList.add("addBox");
    const iconeImg = document.createElement("i");
    iconeImg.classList.add("fa-regular", "fa-image");
    const addImgButton = document.createElement("input");
    addImgButton.type = "button";
    addImgButton.value = "+ Ajouter photo";
    addImgButton.classList.add("addImgButton")
    const addImgText = document.createElement("p");
    addImgText.innerText = "jpg, png : 4mo max";
    const inputCtn = document.createElement("div")
    inputCtn.classList.add("inputCtn");
    const labelInputTitle = document.createElement("label");
    labelInputTitle.for = "Title";
    labelInputTitle.innerText = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.id = "Title";
    inputTitle.type = "text";
    const labelSelectCategory = document.createElement("label");
    labelSelectCategory.for = "category";
    labelSelectCategory.innerText = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.id = "category";
    const border = document.createElement("div");
    border.classList.add("border");
    const formSubmitButton = document.createElement("input");
    formSubmitButton.classList.add("formSubmitButton");
    formSubmitButton.type = "button";
    formSubmitButton.value = "Valider";

    modalWrapper.appendChild(addForm);
    addForm.appendChild(addBox);
    addBox.appendChild(iconeImg);
    addBox.appendChild(addImgButton);
    addBox.appendChild(addImgText);
    addForm.appendChild(inputCtn);
    inputCtn.appendChild(labelInputTitle);
    inputCtn.appendChild(inputTitle);
    inputCtn.appendChild(labelSelectCategory);
    inputCtn.appendChild(selectCategory);
    addForm.appendChild(border);
    addForm.appendChild(formSubmitButton);
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
    // on crée la modale
    createModal()
    // on affiche la modale
    openModal()
    // on ferme la modale
    closeModal()
    // on affiche les travaux dans la modale
    displayWorksInModal(works)


}

init()


