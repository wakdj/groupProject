
// const firebaseConfig = {
//   apiKey: "AIzaSyBnOmxGqAgf0IUtjX0USeikuHNlWNHNYIo",
//   authDomain: "groupproject-c8efc.firebaseapp.com",
//   projectId: "groupproject-c8efc",
//   storageBucket: "groupproject-c8efc.appspot.com",
//   messagingSenderId: "628063358546",
//   appId: "1:628063358546:web:67f4610969c855a285198b",
//   measurementId: "G-Q5TVWP11C9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js'
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBnOmxGqAgf0IUtjX0USeikuHNlWNHNYIo",
    authDomain: "groupproject-c8efc.firebaseapp.com",
    projectId: "groupproject-c8efc",
    storageBucket: "groupproject-c8efc.appspot.com",
    messagingSenderId: "628063358546",
    appId: "1:628063358546:web:67f4610969c855a285198b",
    measurementId: "G-Q5TVWP11C9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth()
  const database = getDatabase()


document.addEventListener('DOMContentLoaded', function () {
    console.log(app)
    console.log(analytics)
    console.log(auth)
    console.log(database)
    const loginP = document.querySelector("#loginToggle")
    const loginForm = document.querySelector("#loginForm")
    const newAccount = document.querySelector("#newAccount")
    const emailField = document.querySelector("#emailField")
    const submitLogin = document.querySelector("#submitLogin")
    function toggleLoginView() {
        loginP.addEventListener("click", () =>{
            loginForm.classList.toggle("hidden")
        })
        newAccount.addEventListener("click", () =>{
            emailField.classList.toggle("hidden")
            textOption = emailField.classList.value === "" ? ["Create Account","Go Back To Login"] : ["Login", "Create a New Account"]
            submitLogin.value = textOption[0]
            newAccount.textContent = textOption[1]
            
        })
    }
    document.getElementById('submitLogin').addEventListener('click', function(event) {
        event.preventDefault(); 
        var username = document.getElementsByName('username')[0].value;
        console.log(username)
        var password = document.getElementsByName('password')[0].value;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password })
        })
        .then(response => {
            if (!response.ok) {
                console.error("error")
                throw new Error('Fail');
            }
            return response.json();
        })
        .then(data => {
            var responseElement = document.querySelector('.response p');
            responseElement.textContent = data.answer;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    toggleLoginView();
});

