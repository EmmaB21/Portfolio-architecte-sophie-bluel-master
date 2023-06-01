


// ******************************** PROJETS - HOMEPAGE ******************************************



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



// ******************************** MODE EDITION - HOMEPAGE ******************************************



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
    let token = sessionStorage.getItem("token")
    const isLogged = token ? true : false;
    console.log(isLogged);
    // On modifie l'affichage et la redirection du lien login
    (isLogged) ? loginLink.innerHTML = "logout" : "login";
    (isLogged) ? loginLink.href = "./index.html" : "./login.html";
    loginLink.addEventListener("click", () => {
        sessionStorage.removeItem("token");
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



// ******************************** GALERIE - MODALES ******************************************



function openModal() {
    // on récupère le lien d'ouverture de la modale
    const openModalLink = document.querySelector(".modalLink");
    // au clic, on affiche la modale en supprimant la classe css contenant le display:none
    openModalLink.addEventListener("click", async () => {
        const displayModal = document.querySelector(".modal");
        // on appelle la création de modale
        createModal();
        // on enlève le display none
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

// on crée la modale galerie
async function createModal() {
    const modalWrapper = document.querySelector(".modal-wrapper")
    modalWrapper.innerHTML = "";
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.textContent = "Galerie photo";
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

    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalAddTitle);
    modalWrapper.appendChild(modalPhotoCtn);
    modalWrapper.appendChild(modalBorder);
    modalWrapper.appendChild(modalAddButton);
    modalWrapper.appendChild(modalRemoveButton);

    const works = await loadWorks()
    displayWorksInModal(works);
    openAddWorks()
}

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

function deleteWorks(photo, photoElement) {
    // On ajoute l'icône de suppression
    const iconeTrashPhoto = document.createElement("i");
    iconeTrashPhoto.classList.add("fa-solid", "fa-trash-can");
    photoElement.appendChild(iconeTrashPhoto);
    // On supprime le projet au clic sur l'icône
    iconeTrashPhoto.addEventListener("click", async () => {
        const token = JSON.parse(sessionStorage.getItem("token"));
        let id = photo.id;

        try {
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
        } catch (error) { alert("problème de connexion au serveur") }
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
    // au clic, on appelle la modale
    addButton.addEventListener("click", () => {
        const modalWrapper = document.querySelector(".modal-wrapper");
        modalWrapper.innerHTML = "";
        createNewModal(modalWrapper)
    })
}



// ******************************** AJOUT PHOTO - MODALES ******************************************



// on crée la modale d'ajout de projet
function createNewModal(modalWrapper) {
    // au clic sur le bouton retour, on met à jour l'affichage et on recrée la modale galerie
    const iconeBack = document.createElement("i");
    iconeBack.classList.add("fa-solid", "fa-arrow-left");
    iconeBack.addEventListener("click", () => {
        createModal()
    })
    // on crée la modale ajout de projet
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.textContent = "Ajout photo";

    modalWrapper.appendChild(iconeBack);
    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalAddTitle);

    // on ajoute le formulaire
    createForm(modalWrapper)
}

// on crée le formulaire
function createForm(modalWrapper) {
    const addForm = document.createElement("form");
    addForm.classList.add("addForm");
    const addBox = document.createElement("div");
    addBox.classList.add("addBox");
    const iconeImg = document.createElement("i");
    iconeImg.classList.add("fa-regular", "fa-image");
    const addImgButton = document.createElement("button");
    addImgButton.innerText = "+ Ajouter photo";
    addImgButton.classList.add("addImgButton")
    const inputFileBtn = document.createElement("input");
    inputFileBtn.type = "file";
    inputFileBtn.accept = ".jpg, .png"
    inputFileBtn.classList.add("inputFileBtn");
    const photoPreview = document.createElement("img");
    photoPreview.id = "photoPreview";
    const addImgText = document.createElement("p");
    addImgText.innerText = "jpg, png : 4mo max";
    const inputCtn = document.createElement("div")
    inputCtn.classList.add("inputCtn");
    const labelInputTitle = document.createElement("label");
    labelInputTitle.setAttribute("for", "Title");
    labelInputTitle.innerText = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.id = "Title";
    inputTitle.type = "text";
    const labelSelectCategory = document.createElement("label");
    labelSelectCategory.setAttribute("for", "category");
    labelSelectCategory.innerText = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.id = "category";
    const border = document.createElement("div");
    border.classList.add("border");
    const formSubmitButton = document.createElement("input");
    formSubmitButton.classList.add("formSubmitButton");
    formSubmitButton.type = "submit";
    formSubmitButton.value = "Valider";
    formSubmitButton.disabled = true;

    modalWrapper.appendChild(addForm);
    addForm.appendChild(addBox);
    addBox.appendChild(iconeImg);
    addBox.appendChild(addImgButton);
    addBox.appendChild(inputFileBtn);
    addBox.appendChild(photoPreview);
    addBox.appendChild(addImgText);
    addForm.appendChild(inputCtn);
    inputCtn.appendChild(labelInputTitle);
    inputCtn.appendChild(inputTitle);
    inputCtn.appendChild(labelSelectCategory);
    inputCtn.appendChild(selectCategory);
    addForm.appendChild(border);
    addForm.appendChild(formSubmitButton);

    // on ajoute les catégories au sélecteur
    insertCategories(selectCategory)

    // on affiche l'image à ajouter
    inputFileBtn.addEventListener ("change", () => {
        const [file] = inputFileBtn.files;
        if (file) {
            photoPreview.src = URL.createObjectURL(file)
            addImgButton.classList.add("modalHide")
        }
    })

    // On écoute les événements de modification des champs
    inputFileBtn.addEventListener("change", validateForm);
    inputTitle.addEventListener("input", validateForm);
    selectCategory.addEventListener("change", validateForm);

    // Validation du formulaire
    function validateForm() {
        // On vérifie si les champs sont remplis
        if (inputFileBtn.value !== "" && inputTitle.value !== "" && selectCategory.value !== "0") {
            formSubmitButton.disabled = false; // On active le bouton "submit"
            formSubmitButton.classList.add("sendForm")
        } else {
            formSubmitButton.classList.remove("sendForm")
            formSubmitButton.disabled = true; // On désactive le bouton "submit"
        }
    }

    // On écoute l'envoi du nouveau projet
    formSubmitButton.addEventListener("click", (e) => {
        postNewWork(inputFileBtn, inputTitle, selectCategory)
        e.preventDefault()
    })
}

// On importe le tableau des catégories
async function loadCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    const categories = await response.json()
    return categories;
}

// On insère les catégories dans le sélecteur
async function insertCategories(selectCategory) {
    const categories = await loadCategories()
    categories.unshift({ id: 0, name: "Choisissez une catégorie :" });
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        selectCategory.appendChild(option);
        option.innerHTML = categories[i].name;
        option.value = categories[i].id;
    }
};

// On envoie le nouveau projet
async function postNewWork(inputFileBtn, inputTitle, selectCategory) {

    const formData = new FormData();
    const newWorkImg = inputFileBtn.files[0];
    const newWorkTitle = inputTitle.value;
    const newWorkCategory = selectCategory.value;
    const token = JSON.parse(sessionStorage.getItem("token"));

    formData.append("image", newWorkImg);
    formData.append("title", newWorkTitle);
    formData.append("category", newWorkCategory);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token.token}`,
            },
            body: formData
        })
        if (response.ok) {
            createModal()
            const works = await loadWorks();
            displayWorks(works);
        }
    } catch (error) { alert("problème de connexion au serveur") }
}



// ******************************** INIT FONCTIONS ******************************************



async function init() {
    // on veut récupérer la liste des works
    const works = await loadWorks()
    // on veut afficher la liste des works dans la page
    displayWorks(works)
    // on veut filtrer les travaux
    filterWorks(works)
    // on modifie la page après identification
    logged()
    // on affiche la modale
    openModal()

}

init()

