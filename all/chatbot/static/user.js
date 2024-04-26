
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set,get,child,remove } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js'

/*
REFACTORING NEEDED DUE TO THE AMOUNT OF REPETITION
*/
  const firebaseConfig = {
    apiKey: "AIzaSyBnOmxGqAgf0IUtjX0USeikuHNlWNHNYIo",
    authDomain: "groupproject-c8efc.firebaseapp.com",
    projectId: "groupproject-c8efc",
    storageBucket: "groupproject-c8efc.appspot.com",
    messagingSenderId: "628063358546",
    appId: "1:628063358546:web:67f4610969c855a285198b",
    measurementId: "G-Q5TVWP11C9"
  };

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
    const logoutP = document.querySelector("#logout")
    const loginForm = document.querySelector("#loginForm")
    const newAccount = document.querySelector("#newAccount")
    const emailField = document.querySelector("#emailField")
    const submitLogin = document.querySelector("#submitLogin")
    const submitNewAccount = document.querySelector("#createAccount")
    const confirmPasswordFieldInput = document.querySelector("#confirmPasswordField")
    const unorderedList = document.createElement("ul")
    unorderedList.classList.add("hidden")
    
    checkAuthState()
    
    
function checkAuthState() {
    const user = auth.currentUser;
    if (user) {
        console.log("User is signed in:", user.uid);
        logoutP.classList.remove("hidden")
        loginP.classList.add("hidden")
        addSaveButton()
        displayPastChatNames()
        newChat()
        logoutP.addEventListener("click",() =>{
            signOut(auth).then(() => {
                logoutP.classList.add("hidden")
                loginP.classList.remove("hidden")
                clearHTML()
              }).catch((error) => {
                    console.log("oopsie")
              });
        })
    } else {
        
        removeSaveButton()
        removePastChats()
        clearHTML()
        removeloginResponse()
        clearPastChats()
        console.log("No user is signed in.");
    }
}

    auth.onAuthStateChanged(user => {
        checkAuthState();
    });
    checkAuthState();

    function newChat(){
       const emptyChat = document.querySelector(".empty")
        emptyChat.addEventListener("click", () =>{
            clearHTML()
        }) 
    }

    function clearPastChats(){
       const childNodes = Array.from(unorderedList.childNodes);
        childNodes.forEach(e => {
            if (e.nodeName === "LI") {
                unorderedList.removeChild(e);
                console.log(e.textContent);
                console.log("removed");
            }
        });
        const pastChatP = document.querySelector("#pastChats")
        const pastChatDiv = document.querySelector(".past-chat");
        pastChatDiv.appendChild(unorderedList)
        
        const li = document.createElement("li")
        li.textContent = "You are not logged in"
        unorderedList.appendChild(li)
        // pastChatP.addEventListener("click", () =>{
        //     //unorderedList.classList.toggle("hidden")
        //     //console.log("toggled")
        // })
    }
    function addSaveButton(){
        const inputArea = document.querySelector(".input-container")
        const newButton = document.createElement("button")
        newButton.classList.add("btn")
        newButton.setAttribute("id","saveButton")
        newButton.textContent = "Save"
        inputArea.appendChild(newButton)
        save()
    }
    function removeloginResponse(){
        const responseArea = document.querySelector(".response p")
        responseArea.textContent = ""
    }

    function displayPastChatNames() {
        const childNodes = Array.from(unorderedList.childNodes);
        childNodes.forEach(e => {
            if (e.nodeName === "LI") {
                unorderedList.removeChild(e);
                console.log(e.textContent);
                console.log("removed");
            }
        });
        const pastChatP = document.querySelector("#pastChats");
        const pastChatDiv = document.querySelector(".past-chat");
        unorderedList.classList.add("pastChatUl")
        const emptyChat = document.createElement("li")
        
        //emptyChat.classList.add("previous-chat")
        emptyChat.classList.add("empty")
        emptyChat.textContent = "New Chat"
        unorderedList.appendChild(emptyChat)
        const dbRef = ref(database);
        const userId = auth.currentUser.uid;
        let chatNames = new Set()
        get(child(dbRef, `users/${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const res = snapshot.val();
                    console.log(res)
                    for (const key in res) {
                        if (!key.includes("email") && !key.includes("profile_picture")) {
                            chatNames.add(key);
                        }
                    }
                    if(chatNames.length === 0){
                        chatNames.add("No chats available")
                    }
                    const chatNameArr = Array.from(chatNames)
                    console.log(chatNameArr)
                    return chatNameArr
                } else {
                    throw new Error("Fail");
                    
                }
            })
            .then((chatNameArr) => {
                const chatNameElements = chatNameArr.map(chatName => {
                    const newli = document.createElement("li");
                    newli.classList.add("previous-chat");
                    newli.textContent = chatName;
                    const span = document.createElement("button")
                    span.classList.add("delete")
                    span.textContent = "X"
                    newli.appendChild(span)
                    return newli;
                });
                return chatNameElements;
            })
            .then((chatNameElements) => {
                chatNameElements.forEach(element => {
                    unorderedList.appendChild(element);
                });
                pastChatDiv.appendChild(unorderedList)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function toggleP() {
        const pastChatP = document.querySelector("#pastChats");
       
    
        pastChatP.addEventListener("click", () => {
            unorderedList.classList.toggle("hidden");
            console.log("toggled");
        });
    
        unorderedList.addEventListener("click", (event) => {
            if (event.target.tagName === "LI") {
                const pastChats = event.target;
                let pastChatsText = pastChats.textContent
                pastChatsText = pastChatsText.substring(0, pastChatsText.length - 1);
                console.log(pastChats.textContent + " rwegfurnu9rg");
    
                if (pastChats.textContent !== "New Chat") {
                    displayPastMessages(pastChatsText);
                    console.log("iwufnw");
                }
            }
        });
    }

    function deleteChatFromDB(){
            unorderedList.addEventListener("click", (event) => {
                if (event.target.tagName === "BUTTON") {
                    const pastChats = event.target;
                    let chatName = pastChats.parentNode.textContent;
                    chatName = chatName.substring(0, chatName.length - 1);
                    console.log(chatName);
                    console.log(pastChats.textContent);
                    //const dbRef = ref(database);
                    const userId = auth.currentUser.uid;
                    const chatRefToRemove = ref(database, `users/${userId}/${chatName}`);
                    remove(chatRefToRemove)
                        .then(() => {
                            alert(`Chat "${chatName}" will be deleted from our database shortly.`)
                        })
                        .catch((error) => {
                            console.error("fail");
                        });
                }
            });
    }

    function displayPastMessages(elem){
        const dbRef = ref(database);
        const userId = auth.currentUser.uid;
        let userMessages = []
        let botResponse = []
        let chats = {}
        get(child(dbRef, `users/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const res = snapshot.val();
                userMessages = res[elem]["userDict"]
                botResponse = res[elem]["botDict"]
                userMessages?.forEach((e,index) =>{
                    chats[e] = botResponse[index]
                })
                return chats
            } else {
                throw new Error("Fail");
                
            }
        })
        .then((chats) => {
            console.log("reached")
            clearHTML()
            populate(chats)
        })
        .catch((error) => {
            console.error(error);
        });
    }

    function clearHTML(){
        const outputArea = document.querySelector("#outputArea");
        const outputUL = outputArea.querySelector("ul");
        const messageArea = document.querySelector("#userMessage");
        const messageUL = messageArea.querySelector("ul");
        outputUL.childNodes.forEach(e => {
            if (e.nodeName === "LI" && !e.classList.contains("space")) {
                outputUL.removeChild(e);
            }
        });
        messageUL.childNodes.forEach(e => {
            if (e.nodeName === "LI") {
                messageUL.removeChild(e);
            }
        });
    }

    function populate(chats){
        const outputArea = document.querySelector('#outputArea > ul');
        const userMessage = document.querySelector("#userMessage > ul");
        Object.entries(chats).forEach(([key]) => {
            const botText = chats[key][0]
            const message = key
            const spaceForBot = document.createElement("br")
            const spaceForUser = document.createElement("br")
            const spaceForChoices = document.createElement("br")
            const newLiForBot = document.createElement("li");
            const newLiForUser = document.createElement("li");
            const newSpanForBot = document.createElement("span");
            const newSpanForUser = document.createElement("span")
            const newDivForBot = document.createElement("div");
            const newDivForUser = document.createElement("div");
            const responseText = document.createTextNode(botText);
            newSpanForBot.appendChild(responseText)
            spaceForChoices.classList.add("choices-container")
            newDivForBot.appendChild(newSpanForBot);
            newDivForBot.appendChild(spaceForChoices);
            newLiForBot.appendChild(newDivForBot);
            newLiForBot.appendChild(spaceForBot);

            const userText = document.createTextNode(message);
            newSpanForUser.appendChild(userText)
            newDivForUser.appendChild(newSpanForUser)
            newLiForUser.appendChild(newDivForUser);
            newLiForUser.appendChild(spaceForUser);
            userMessage.appendChild(newLiForUser);
            outputArea.appendChild(newLiForBot);
            adjustHeightDifference(userMessage,outputArea);
            console.log(chats[key].length)
            if(chats[key].length >= 3){
                addButtons(chats[key][1], newDivForBot)
                  adjustHeightDifference(userMessage,outputArea) 
            }
            console.log(chats[key].length)
            if(chats[key].length === 5){
                disableButtons(chats[key][3])
                addSpotifyInfo(chats[key][2],chats[key][4],newDivForBot)
                adjustHeightDifference(userMessage,outputArea) 
           // }
            }
            
        });

    }

    function addButtons(buttonText,area){
        const newDivForChoices = document.createElement("div");
        let optionsArr = buttonText.split(" ")
        console.log(optionsArr)
        const choice1 = document.createElement("button");
        const choice2 = document.createElement("button");
        const choice3 = document.createElement("button");
        const op1 = document.createTextNode(optionsArr[0]);
        const op2 = document.createTextNode(optionsArr[1]);
        const op3 = document.createTextNode(optionsArr[2]);
        choice1.classList.add("choice");
        choice2.classList.add("choice");
        choice3.classList.add("choice");
        choice1.appendChild(op1);
        choice2.appendChild(op2);
        choice3.appendChild(op3);
        newDivForChoices.appendChild(choice1);
        newDivForChoices.appendChild(choice2);
        newDivForChoices.appendChild(choice3);
        area.appendChild(newDivForChoices);
        // adjustHeightDifference(um,ou) 
    }


    function disableButtons(choice){
        const buttons = document.querySelectorAll(".choice")
        //buttons.disabled = true
        buttons.forEach(b =>{
            b.disabled = true;
            if(b.textContent === choice){
                b.style.color = "pink"
            }
        })

    }

    function addSpotifyInfo(song,link,area){
        const recommendation = document.createElement("span");
        const linkTag = document.createElement("a") 
        const newDivForAnswers = document.createElement('div');
        //elem.style.color = "pink"
        const recommendationText = document.createTextNode(song + ". Here's a ")
        const linkText = document.createTextNode("Spotify link");
        linkTag.appendChild(linkText);
        linkTag.href = link
        linkTag.target = "_blank"
        //console.log(data.answer)
        recommendation.appendChild(recommendationText)
        recommendation.appendChild(linkTag)
        newDivForAnswers.appendChild(recommendation)
        area.appendChild(newDivForAnswers)
        // adjustHeightDifference(um,ou) 
    }

    function adjustHeightDifference(userMessage,outputArea) {
        const chatResponseHeight = outputArea.getClientRects()[0].height;
        const userInputHeight = userMessage.getClientRects()[0].height;
        if(chatResponseHeight !== userInputHeight){
            const difference = chatResponseHeight - userInputHeight
            const lastUserListItem = userMessage.lastChild;

            
            const lastBotListItem = outputArea.lastChild;
            console.log(lastBotListItem)

            const lastUserListItemHeight = lastUserListItem.clientHeight;   
            const lastBotListItemHeight = lastBotListItem.clientHeight;

            console.log(lastBotListItemHeight)  
            lastUserListItem.style.height = (lastBotListItemHeight) + "px"
            lastUserListItem.style.padding = 0
        }

    }

    function removePastChats(){
        const pastChatPs = document.querySelectorAll(".previous-chat")
        pastChatPs.forEach(e =>{
         e.remove()
        })
    }
    

    function removeSaveButton(){
        const saveButton = document.querySelector("#saveButton")
        if(saveButton){
        saveButton.remove()
        }
    }
    function save(){
        const saveButton = document.querySelector("#saveButton")
        if(saveButton){
        
        saveButton.addEventListener("click",()=>{
            console.log("clicked")
           let chatName =  prompt("Name your chat").trim()
           if(chatName === ""){
            chatName = "Chat saved at: " + new Date().toLocaleTimeString()
           }
            const userDict = {}
            const botDict = {}
            const userMessagesRef = ref(database, 'users/' + auth.currentUser.uid + '/messages');
            const userFeelings = document.querySelectorAll('#userMessage ul li');
            const botResponses = document.querySelectorAll('#outputArea ul li');
            console.log(botResponses)
            console.log("!!!!!!!!!!!!!!!!!")
            userFeelings.forEach((userFeeling,index) => {
                const arr = [userFeeling.textContent.trim()]
                userDict[(index+1)] = arr
            });
            botResponses.forEach((botResponse, index) => {
                if(index !== 0){
                    const arr = botResponse.outerHTML.split("<div>")
                    if(arr[1]){
                       const split = arr[1].split("<span>")
                        const split2 = split[1].split("</span>")
                        arr[1] = split2[0]
                    }
                    if(arr[2]){
                        const split = arr[2].split("<button")
                        let choosen = ""
                        if (split[1].includes("disabled")) {
                            split.forEach((e) => {
                                if (e.includes("color")) {
                                    choosen = e.split(">")[1].split("<")[0];
                                }
                            });
                        }
                        let buttons = "";
                        split.forEach((e) => {
                            if (e) {
                                const buttonText = e.split(">")[1].split("<")[0].trim(); 
                                buttons += buttonText + " ";
                            }
                        });
                        arr.push(choosen)
                        arr[2] = buttons
                    }
                    if(arr[3]){
                        let string = arr[3]
                        string = string.replace("<span>","")
                        const split = string.split(". ")
                        const link = string.split(`"`)[1]
                        arr[3] = split[0]
                        arr.push(link)
                    }
                    arr.shift()
                    botDict[(index)] = arr
                }
                console.log(userDict)
                console.log(botDict)
            });

            set(ref(database, 'users/' + auth.currentUser.uid + "/" + chatName), {
                chatName: chatName,
                userDict: userDict,
                botDict : botDict
            });
        })
    }
}

   
    function toggleLoginView() {
        loginP.addEventListener("click", () =>{
            loginForm.classList.toggle("hidden")
        })
        newAccount.addEventListener("click", () =>{
            confirmPasswordFieldInput.classList.toggle("hidden")
            submitNewAccount.classList.toggle("hidden")
            submitLogin.classList.toggle("hidden")
           const textOption = confirmPasswordFieldInput.classList.value === "" ? ["Create Account","Go Back To Login"] : ["Login", "New Account"]
            newAccount.textContent = textOption[1]
            if(confirmPasswordFieldInput.classList === ""){
                submitLogin.disabled = true;
            }
            
        })
    }
    function login(){
        submitLogin.addEventListener('click', function(event) {
            event.preventDefault(); 
            const email = document.getElementsByName('email')[0].value;
            console.log(email)
            const password = document.getElementsByName('password')[0].value;
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, password: password })
            })
            .then(response => {
                if (!response.ok) {
                    console.error("error")
                    throw new Error('Fail');
                }
                return response.json();
            })
            .then(data => {
                if(data.answer === "Success"){
                    signInWithEmailAndPassword(auth, email, password).then(cred => {
                        console.log(cred);
                         const responseElement = document.querySelector('.response p');
                         responseElement.textContent = "You are now logged in";
                         const user = auth.currentUser;
                         loginForm.classList.add("hidden")

          
                    }).catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.log(errorMessage[0])
                      const responseElement = document.querySelector('.response p');
                      responseElement.textContent = errorMessage;
                      
                    });
                // });
                } else{
                    const responseElement = document.querySelector('.response p');
                    responseElement.textContent = data.answer;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
        
                
    }
    function createAccount(){
        // if(confirmPasswordFieldInput.classList.value === "hidden"){
        //     return
        // }
        submitNewAccount.addEventListener('click', function(event) {
            event.preventDefault(); 
            const email = document.getElementsByName('email')[0].value;
            console.log(email)
            const password = document.getElementsByName('password')[0].value;
            const confirmPassword = document.getElementsByName('confirmPassword')[0].value;
            fetch('/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, password: password,confirmPassword: confirmPassword })
            })
            .then(response => {
                if (!response.ok) {
                    console.error("error")
                    throw new Error('Fail');
                }
                return response.json();
            })
            .then(data => {
                // const responseElement = document.querySelector('.response p');
                // responseElement.textContent = data.answer;
                if(data.answer === "Success"){
                    createUserWithEmailAndPassword(auth, email, password).then(cred => {
                        console.log(cred);
                         const responseElement = document.querySelector('.response p');
                         responseElement.textContent = data.answer;
                         const loginForm = document.querySelector("#loginForm")
                         loginForm.classList.add("hidden")
                         console.log(auth.currentUser)
                         set(ref(database, 'users/' + auth.currentUser.uid), {
                            email: email,
                            profile_picture : "me.jpg"
                        });
                            //set(ref(database,'UsersAuthList/' + cred.user.uid))
                        //ref.child("Users" + cred.user.uid).set("chocolate")
                    }).catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.log(errorCode)
                      const responseElement = document.querySelector('.response p');
                         responseElement.textContent = error.message
                      
                    });
                // });
                }else{
                    const responseElement = document.querySelector('.response p');
                    responseElement.textContent = data.answer;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
      
                }
    
    toggleLoginView();
    toggleP()
    login();
    createAccount();
    deleteChatFromDB()
});

