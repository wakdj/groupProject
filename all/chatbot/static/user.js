
document.addEventListener('DOMContentLoaded', function () {
    const loginP = document.querySelector("#loginToggle")
    const loginForm = document.querySelector("#loginForm")
    const newAccount = document.querySelector("#newAccount")
    const emailField = document.querySelector("#emailField")
    const submitLogin = document.querySelector("#submitLogin")
    function handleLogin() {
        loginP.addEventListener("click", () =>{
            loginForm.classList.toggle("hidden")
        })
        newAccount.addEventListener("click", () =>{
            emailField.classList.toggle("hidden")
            submitLogin.classList.toggle("hidden")
        })
        console.log(message);
        if (message !== '') {
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => {
                console.log("hi")
                if (!response.ok) {
                    console.Error("error")
                    throw new Error('Fail');
                }
                return response.json();
            })
            .then(data => {
                const botText = data.answer.split("~")[0];
                
                adjustHeightDifference(userMessage,outputArea);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    handleLogin();
});

