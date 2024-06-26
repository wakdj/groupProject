
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut, onAuthStateChanged,deleteUser } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set,get,child,remove } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js'

/*
This script handles most of the functionality for the user accounts e.g. 
login, logout, loading chats, deleting chats, saving chats etc.
*/

// config for firebase, this is auto-generated
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
    
    // console.log(app)
    // console.log(analytics)
    // console.log(auth)
    // console.log(database)
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
    

// renders elements based on whether the user is logged in or not
function checkAuthState() {
    const user = auth.currentUser;
    if (user) {
        console.log("User is signed in:", user.uid);
        logoutP.classList.remove("hidden")
        loginP.classList.add("hidden")
        addSaveButton()
        displayPastChatNames()
        newChat()
        toggleDeleteAccountView()
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
        removeDeleteAccountButton()
        console.log("No user is signed in.");
    }
}

    auth.onAuthStateChanged(user => {
        checkAuthState();
    });
    checkAuthState();

    // clears the chat area, giving the illusion of a new chat
    function newChat(){
       const emptyChat = document.querySelector(".empty")
        emptyChat.addEventListener("click", () =>{
            clearHTML()
        }) 
    }

    // delete account button will only be visible if user is logged in 
    function toggleDeleteAccountView(){
        const deleteAccountDiv = document.querySelector(".delete-account")
        deleteAccountDiv.classList.toggle("hidden")
    }
    // called when user is not logged in
    function removeDeleteAccountButton(){
        const deleteBTn = document.querySelector(".delete-account")
        if(!deleteBTn.classList.contains("hidden")){
            deleteBTn.classList.add("hidden")
        }
    }

    // clearing the html rendered in the past chat area called when user is not logged in
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
    }

    // save button in order to save chats when logged in
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
        // removing any nodes already there. i think this is not required
        // but i don't want to remove it just in case
        const childNodes = Array.from(unorderedList.childNodes);
        childNodes.forEach(e => {
            if (e.nodeName === "LI") {
                unorderedList.removeChild(e);
                console.log(e.textContent);
                console.log("removed");
            }
        });
        // creating ul for future population
        const pastChatP = document.querySelector("#pastChats");
        const pastChatDiv = document.querySelector(".past-chat");
        unorderedList.classList.add("pastChatUl")
        const emptyChat = document.createElement("li")
        emptyChat.classList.add("empty")
        emptyChat.textContent = "New Chat"
        unorderedList.appendChild(emptyChat)
        // getting instance of database
        const dbRef = ref(database);
        const userId = auth.currentUser.uid;
        let chatNames = new Set()
        // accessing/ getting data from db 
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
                    // chat names from db
                    const chatNameArr = Array.from(chatNames)
                    //console.log(chatNameArr)
                    return chatNameArr
                } else {
                    throw new Error("Fail");
                }
            })
            .then((chatNameArr) => {
                // creating lis with name of past chats
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
            // appending lis to ul
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

    // hiding/ showing past chats when clicking on past chats p 
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

    function deleteUserAccount(){
        const deleteButton = document.querySelector("#deleteAccount")
        deleteButton.addEventListener('click', ()=>{
            const auth = getAuth();
            const user = auth.currentUser;
            const userID = auth.currentUser.uid
            const chatRefToRemove = ref(database, `users/${userID}`);
            console
            remove(chatRefToRemove)
            // .then(() => {
            //     alert(`Chat "${chatName}" will be deleted from our database shortly.`)
            // })
            // .catch((error) => {
            //     console.error("fail");
            // });
            deleteUser(user).then(() => {
            alert("Account Deleted")
            
            }).catch((error) => {
            console.error(error)
            alert("Account Deletion Unsuccessful")
            });

        })
    }
    /*
    gets oast chats from db
    */
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

    /* 
    clears the chat area
    */ 
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

    // populating chat area with past chat of user's choice
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

    // adding genre option buttons to one old response
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

    /* 
    used when reloading a saved chat in order to 
    make it the same as before as.
    */
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

    /* 
    same as in script.js, as the outputs can be different
    heights due to different amounts of text the heights
    of the user input message needs to be the same height
    as the bot response message, otherwise the differences
    will compound
    */
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

    /*
    saving a chat 
    saves the chat in a structured way based on which 
    part it is in
    */
    function save(){
        const saveButton = document.querySelector("#saveButton")
        if(saveButton){
        saveButton.addEventListener("click",()=>{
            console.log("clicked")
           let chatName =  prompt("Name your chat").trim()
           // if no name given by user the chat name is the time
           if(chatName === ""){
            chatName = "Chat saved at: " + new Date().toLocaleTimeString()
           }
           // separate dicts for user input and bot response 
            const userDict = {}
            const botDict = {}
            const userMessagesRef = ref(database, 'users/' + auth.currentUser.uid + '/messages');
            const userFeelings = document.querySelectorAll('#userMessage ul li');
            const botResponses = document.querySelectorAll('#outputArea ul li');
            /*
            console.log(botResponses)
            console.log("!!!!!!!!!!!!!!!!!")
            adding each user message to user dict
            */
            userFeelings.forEach((userFeeling,index) => {
                const arr = [userFeeling.textContent.trim()]
                // adding 1 to align user dict with botdict
                // as botdict starts with an empty li
                userDict[(index+1)] = arr
            });
            
            // breaking down the bot responses into distinct sections 
            // and grabbing the text from each relevant part
            botResponses.forEach((botResponse, index) => {
                if(index !== 0){
                    console.log(botResponse.innerText)
                    const string = botResponse.textContent
                    // 
                    if(string.includes("<") || string.includes(">")){
                        alert("Don't be sneaky")
                    }else{
                    const arr = botResponse.outerHTML.split("<div>")
                    // each of the following if statements breaks down
                    // the html into "clean" text that can be saved
                    // to the db in a suitable format for reloading
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
                        const split = string.split(`. Here's`)
                        const link = string.split(`"`)[1]
                        arr[3] = split[0]
                        arr.push(link)
                    }
                    arr.shift()
                    botDict[(index)] = arr
                }
                console.log(userDict)
                console.log("hi ")
                console.log(botDict)
              }
            });

            // adding relevant text data to db
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

    // using flask to analyse inputs
    // if inputs are suitable firebase will handle login
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


    //creating an account with the help of firebase
    function createAccount(){
        submitNewAccount.addEventListener('click', function(event) {
            event.preventDefault(); 
            const email = document.getElementsByName('email')[0].value;
            console.log(email)
            const password = document.getElementsByName('password')[0].value;
            const confirmPassword = document.getElementsByName('confirmPassword')[0].value;
            // interaction with flask app
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
                if(data.answer === "Success"){
                    // firebase method
                    createUserWithEmailAndPassword(auth, email, password).then(cred => {
                        //console.log(cred);
                         const responseElement = document.querySelector('.response p');
                         responseElement.textContent = data.answer;
                         const loginForm = document.querySelector("#loginForm")
                         loginForm.classList.add("hidden")
                         console.log(auth.currentUser)
                         set(ref(database, 'users/' + auth.currentUser.uid), {
                            email: email,
                            profile_picture : "me.jpg" // this doesn't actually upload an image, just a test
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
    deleteUserAccount()
});

