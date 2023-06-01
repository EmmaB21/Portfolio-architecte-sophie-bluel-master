
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
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(logData)
            })

            // On stocke le token récupéré dans le sessionStorage
            const token = await response.json();
            sessionStorage.setItem("token", JSON.stringify(token));

            // on redirige ou on affiche un message d'erreur
            (response.ok) ? window.location.href = "./index.html" : error.textContent = "Nom d'utilisateur ou mot de passe incorrect"

        } catch (error) { alert("problème de connexion au serveur") }
    })
}

login()
