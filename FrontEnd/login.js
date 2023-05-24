
function login() {
    // On récupère les données à envoyer
    const loginForm = document.querySelector(".login_form");
    const error = document.querySelector(".error")
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const logData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=motDePasse]").value
        }
        // On envoie les données
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logData)
        })
            .catch(error.textContent = "Problème de connexion au serveur")
        // On stocke le token récupéré dans le localStorage
        const token = await response.json();
        sessionStorage.setItem("token", JSON.stringify(token));
        
        // on redirige ou on affiche un message d'erreur
        (response.ok) ? window.location.href = "./index.html" : error.textContent = "Nom d'utilisateur ou mot de passe incorrect"
    })
}

login()
