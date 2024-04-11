
    document.addEventListener('DOMContentLoaded', function () {
        const textInput = document.querySelector('#textInput');
        const predictButton = document.querySelector('#predictButton');
        const outputArea = document.querySelector('#outputArea > ul');
        const userMessage = document.querySelector("#userMessage > ul");
        

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
                    const botText = data.answer.split("~")[0];
                    const intent = data.answer.split("~")[1]
                
                    const spaceForBot = document.createElement("br")
                    const spaceForUser = document.createElement("br")
                    const spaceForChoices = document.createElement("br")
                    // const choice1 = document.createElement("span")
                    // const choice2 = document.createElement("span")
                    // const choice3 = document.createElement("span")

                    const newLiForBot = document.createElement("li");
                    const newLiForUser = document.createElement("li");
                    const newSpanForBot = document.createElement("span");
                    const newSpanForUser = document.createElement("span")
                    // const newDivForChoices = document.createElement("div");
                    const newDivForBot = document.createElement("div");
                    const newDivForUser = document.createElement("div");
                    
                    const responseText = document.createTextNode(botText);
                    
                    // const intentText = document.createTextNode(intent);
                    // const op2 = document.createTextNode("option 2")
                    // const op3 = document.createTextNode("option 3")
                    
                    
                    newSpanForBot.appendChild(responseText)

                    // choice1.classList.add("choice")
                    // choice2.classList.add("choice")
                    // choice3.classList.add("choice")
                    spaceForChoices.classList.add("choices-container")
                    // choice1.appendChild(intentText)
                    // choice2.appendChild(op2)
                    // choice3.appendChild(op3)
                    

                    newDivForBot.appendChild(newSpanForBot);
                    newDivForBot.appendChild(spaceForChoices);
                    
                    // newDivForChoices.appendChild(choice1);
                    // newDivForChoices.appendChild(choice2);
                    // newDivForChoices.appendChild(choice3);
                    // newDivForBot.appendChild(newDivForChoices)
                   // console.log(song_data)
                    newLiForBot.appendChild(newDivForBot);
                    newLiForBot.appendChild(spaceForBot);

                    const userText = document.createTextNode(message);
                    newSpanForUser.appendChild(userText)
                    newDivForUser.appendChild(newSpanForUser)
                    newLiForUser.appendChild(newDivForUser);
                    newLiForUser.appendChild(spaceForUser);
                  //  displayOptions(intent,newDivForBot);
                    userMessage.appendChild(newLiForUser);
                    outputArea.appendChild(newLiForBot);
                    displayOptions(userMessage, intent,newDivForBot,outputArea);
                    adjustHeightDifference(userMessage,outputArea);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }

        predictButton.addEventListener('click', predictMessage);
    });

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

    function displayOptions(um,category, area,ou) {
        const newDivForChoices = document.createElement("div");
        const newDivForAnswers = document.createElement('div');
        const optionsArr = [];
        const recommendation = document.createElement("span");
        console.log(category);
        if (category === "greeting" || category === "thanks" || category === "goodbye" || category === "funny" || category === "") {
            return;
        }
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
    
        let choicesArr = document.querySelectorAll(".choice");
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
                            const recommendationText = document.createTextNode(data.answer[0])
                            const link = document.createTextNode("link");
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
    
