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
                const botText = data.answer.split(":")[0];
                const intent = data.answer.split(":")[1]
                const spaceForBot = document.createElement("br")
                const spaceForUser = document.createElement("br")
                const spaceForChoices = document.createElement("br")
                const choice1 = document.createElement("span")
                const choice2 = document.createElement("span")
                const choice3 = document.createElement("span")

                const newLiForBot = document.createElement("li");
                const newLiForUser = document.createElement("li");
                const newSpanForBot = document.createElement("span");
                const newSpanForUser = document.createElement("span")
                const newDivForChoices = document.createElement("div");
                const newDivForBot = document.createElement("div");
                const newDivForUser = document.createElement("div");
                
                const responseText = document.createTextNode(botText);
                const intentText = document.createTextNode(intent);
                const op2 = document.createTextNode("option 2")
                const op3 = document.createTextNode("option 3")
                
                
                newSpanForBot.appendChild(responseText)

                choice1.classList.add("choice")
                choice2.classList.add("choice")
                choice3.classList.add("choice")
                spaceForChoices.classList.add("choices-container")
                choice1.appendChild(intentText)
                choice2.appendChild(op2)
                choice3.appendChild(op3)
                

                newDivForBot.appendChild(newSpanForBot);
                newDivForBot.appendChild(spaceForChoices);
                newDivForChoices.appendChild(choice1);
                newDivForChoices.appendChild(choice2);
                newDivForChoices.appendChild(choice3);
                newDivForBot.appendChild(newDivForChoices)

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
        // const lastUserListItemStyles = window.getComputedStyle(lastUserListItem);
        // const lastUserListItemPaddingBottom = parseFloat(lastUserListItemStyles.paddingBottom);
        
        const lastBotListItem = outputArea.lastChild;
        console.log(lastBotListItem)

        const lastUserListItemHeight = lastUserListItem.clientHeight;   
        const lastBotListItemHeight = lastBotListItem.clientHeight;
                // const lastBotListItemStyles = window.getComputedStyle(lastBotListItem);
        // const lastBotListItemStylesPaddingBottom = parseFloat(lastBotListItemStyles.paddingBottom);
        // console.log(lastUserListItemPaddingBottom)
        // console.log(lastBotListItemStylesPaddingBottom)
        console.log(lastBotListItemHeight)  
        lastUserListItem.style.height = (lastBotListItemHeight) + "px"
       // lastBotListItem.style.height = (lastBotListItem + spaceHeight) + "px"
        
        lastUserListItem.style.padding = 0
        //userMessage.lastChild.style.paddingTop = -difference
    }

 }
