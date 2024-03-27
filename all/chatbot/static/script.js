
    

function predictMessage() {
    const message = textInput.value.trim();
    if (message !== '') {
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fail');
            }
            return response.json();
        })
        .then(data => {
            const newLiForBot = document.createElement("li");
            const newLiForUser = document.createElement("li");
            const responseText = document.createTextNode(data.answer);
            const userText = document.createTextNode(message);
            newLiForBot.appendChild(responseText);
            newLiForUser.appendChild(userText);
            userMessage.appendChild(newLiForUser);
            outputArea.appendChild(newLiForBot)
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.querySelector('#textInput');
    const predictButton = document.querySelector('#predictButton');
    const outputArea = document.querySelector('#outputArea > ul');
    const userMessage = document.querySelector("#userMessage > ul");
    predictButton.addEventListener('click', predictMessage);
})



console.log("Borders are not staying. Just a guideline")