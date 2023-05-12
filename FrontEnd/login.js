
function login() {
    const loginForm = document.querySelector(".login_form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const logData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=motDePasse]").value
        }
        console.log(JSON.stringify(logData))
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json" },
            body: JSON.stringify(logData)
        })
    })
}
login()
