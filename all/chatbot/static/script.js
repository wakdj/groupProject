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
                    console.log("error")
                    throw new Error('Fail');
                }
                return response.json();
            })
            .then(data => {
                const spaceForBot = document.createElement("br")
                const spaceForUser = document.createElement("br")
               // spaceLi.classList.add("space");
                const newLiForBot = document.createElement("li");
                const newLiForUser = document.createElement("li");
                const newSpanForBot = document.createElement("span");
                const newSpanForUser = document.createElement("span")
                const newDivForBot = document.createElement("div");
                const newDivForUser = document.createElement("div")
                const responseText = document.createTextNode(data.answer);
                
                const userText = document.createTextNode(message);
                newSpanForBot.appendChild(responseText)
                newDivForBot.appendChild(newSpanForBot)
                newLiForBot.appendChild(newDivForBot);
                newLiForBot.appendChild(spaceForBot);
                
                newSpanForUser.appendChild(userText)
                newDivForUser.appendChild(newSpanForUser)
                newLiForUser.appendChild(newDivForUser);
                newLiForUser.appendChild(spaceForUser);

                userMessage.appendChild(newLiForUser);
                outputArea.appendChild(newLiForBot);
                //outputArea.appendChild(spaceLi)
                
                adjustHeightDifference(userMessage,outputArea);
                // console.log(outputArea.getClientRects()[0].height)
                // console.log(userMessage.getClientRects()[0].height)
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
