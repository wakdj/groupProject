/*
This script handles most of the functionality for chatbot interactions e.g.
getting responses from flask app, displaying responses etc.
*/
    
    
    document.addEventListener('DOMContentLoaded', function () {
        // key elements
        const textInput = document.querySelector('#textInput');
        const predictButton = document.querySelector('#predictButton');
        const exploreContainer = document.querySelector(".explore-container")
        console.log(exploreContainer.style.display + "hi")
        const outputArea = document.querySelector('#outputArea > ul');
        const userMessage = document.querySelector("#userMessage > ul");
        const login = document.querySelector(".login")
        const toggleButton = document.querySelector('#toggleSideBar');
        toggleButton.addEventListener('click', toggleSideBar);

        document.querySelector('.how-to-text').addEventListener('click', toggleHowToText);


        function toggleHowToText() {
        var additionalText = document.getElementById("explanationHowToText");
        if (additionalText.style.display === "none") {
        additionalText.style.display = "block";
        } else {
        additionalText.style.display = "none";
    }
}


        // Using the user input from the input area 
        // and passing to the flask application's
        // predict function
        function predictMessage() {
            const message = textInput.value.trim();
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
                    // splitting as the response is delivered in
                    // a sub-optimal manner like so 
                    // result + "~" + tag where the result is the 
                    // response based on the tag (emotion)
                    // e.g. "" should have used an array
                    const botText = data.answer.split("~")[0];
                    const intent = data.answer.split("~")[1]
                    
                    // adding space for ux improvements
                    const spaceForBot = document.createElement("br")
                    const spaceForUser = document.createElement("br")
                    const spaceForChoices = document.createElement("br")
                    
                    // 
                    const newLiForBot = document.createElement("li");
                    const newLiForUser = document.createElement("li");

                    const newSpanForBot = document.createElement("span");
                    const newSpanForUser = document.createElement("span")
                    
                    const newDivForBot = document.createElement("div");
                    const newDivForUser = document.createElement("div");
                    
                    const responseText = document.createTextNode(botText);
                    newSpanForBot.appendChild(responseText)
                    spaceForChoices.classList.add("choices-container")
                    
                    // bot chat elements
                    newDivForBot.appendChild(newSpanForBot);
                    newDivForBot.appendChild(spaceForChoices);
                    newLiForBot.appendChild(newDivForBot);
                    newLiForBot.appendChild(spaceForBot);
                    
                    // user chat elements
                    const userText = document.createTextNode(message);
                    newSpanForUser.appendChild(userText)
                    newDivForUser.appendChild(newSpanForUser)
                    newLiForUser.appendChild(newDivForUser);
                    newLiForUser.appendChild(spaceForUser);
                    userMessage.appendChild(newLiForUser);
                    
                    outputArea.appendChild(newLiForBot);
                    
                    // calling the function to display genre choice buttons
                    displayOptions(userMessage, intent,newDivForBot,outputArea);
                    // Calling adjustHeightDifferent to make sure there is no offset
                    adjustHeightDifference(userMessage,outputArea);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
        
        predictButton.addEventListener('click', predictMessage);
        //toggleSideBar()
    });

    /*
    makes the heights of the chat response and user message
    the same  height
    */
    function adjustHeightDifference(userMessage,outputArea) {
        // Getting the current height
        const chatResponseHeight = outputArea.getClientRects()[0].height;
        const userInputHeight = userMessage.getClientRects()[0].height;
        
        if(chatResponseHeight !== userInputHeight){
            const difference = chatResponseHeight - userInputHeight
            // getting the most recent additions
            const lastUserListItem = userMessage.lastChild;
            const lastBotListItem = outputArea.lastChild;
            //console.log(lastBotListItem)

            const lastUserListItemHeight = lastUserListItem.clientHeight;   
            const lastBotListItemHeight = lastBotListItem.clientHeight;

            //console.log(lastBotListItemHeight) 
            // setting the user chat area to the same heigh as the last
            // "chatbot" response area 
            lastUserListItem.style.height = (lastBotListItemHeight) + "px"
            lastUserListItem.style.padding = 0
        }

    }

    // displaying choice buttons for the genre of song
    function displayOptions(um,category, area,ou) {
        // area for buttons
        const newDivForChoices = document.createElement("div");
        // area for song
        const newDivForAnswers = document.createElement('div');
        const optionsArr = [];
        const recommendation = document.createElement("span");
        //console.log(category);
        
        // categories that shouldn't have a button
        if (category === "greeting" || category === "thanks" || category === "goodbye" || category === "funny" || category === "unknown") {
            return;
        }

        // options defined for each category
        // could be switch-case
        if (category === "sad") {
            optionsArr[0] = "pop";
            optionsArr[1] = "blues";
            optionsArr[2] = "slowcore";
        } else if(category === "happy"){
            optionsArr[0] = "pop";
            optionsArr[1] = "jazz";
            optionsArr[2] = "rock";
        } else if(category === "relaxed"){
            optionsArr[0] = "pop";
            optionsArr[1] = "classical";
            optionsArr[2] = "psychedelic";
        } else if(category === "energetic"){
            optionsArr[0] = "rock";
            optionsArr[1] = "guaracha";
            optionsArr[2] = "drum and bass";
        }
        // creating elems and adding to dom
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
        
        // selecting all buttons
        let choicesArr = document.querySelectorAll(".choice");
        // when one is clicked the postSong
        // flask function receives the category (emotion)
        // and the genre
        // this then returns the data from a random spotify song 
        // of that genre 
        choicesArr.forEach(function (elem) {
            elem.addEventListener("click", function () {
                const message = category + "_" + elem.textContent;
                if (message !== '') {
                    fetch('/postSong', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: message })
                    })
                        .then(response => {
                            console.log("hi");
                            if (!response.ok) {
                                console.error("error");
                                throw new Error('Fail');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const linkTag = document.createElement("a") 
                            elem.style.color = "pink"
                            // song title, artist
                            const recommendationText = document.createTextNode(data.answer[0])

                            const link = document.createTextNode("Spotify link");
                            linkTag.appendChild(link);
                            linkTag.href = data.answer[1]
                            linkTag.target = "_blank"
                            console.log(data.answer)
                            recommendation.appendChild(recommendationText)
                            recommendation.appendChild(linkTag)
                            newDivForAnswers.appendChild(recommendation)
                            choice1.disabled = true
                            choice2.disabled = true
                            choice3.disabled = true
                            area.appendChild(newDivForAnswers)
                            adjustHeightDifference(um,ou) 
                        });
                }
            });
        });
    }

    // only for mobile view
    function toggleSideBar(e){
        //console.log("called")
        e.preventDefault()
        const activites = document.querySelector('#sideBarContainer');
        const container = document.querySelector('.explore-container');
        const toggleButton = document.querySelector("#toggleSideBar")

        // const colour =  container.style.backgroundColor === "rgba(230,215,255,0.4)" ? "transparent" : "rgba(230,215,255,0.4)";
        // const displayType = activites.style.display === "block" ? "none" : "block";
        let displayType = ""
        let bgColour = ""
        if(activites.style.display === "block"){
            displayType = "none"
            bgColour = "transparent"
            toggleButton.style.transform = "rotate(0deg)" 
            container.style.width = "0%"
            container.style.maxWidth = "0%"
        } else{
             displayType = "block"
             bgColour = "rgba(230,215,255,0.8)"
             toggleButton.style.transform = "rotate(90deg)"  
             container.style.width = "40%"
            container.style.maxWidth = "40%" 
        }
        activites.style.display =  displayType
        container.style.backgroundColor = bgColour
        activites.style.transition = "opacity 0.5s ease";
        container.style.transition = "background-color 0.5s ease";
          
        
        }
    
