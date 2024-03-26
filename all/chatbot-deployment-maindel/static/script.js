document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('textInput');
    const predictButton = document.getElementById('predictButton');
    const outputArea = document.getElementById('outputArea');

    predictButton.addEventListener('click', function () {
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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                outputArea.textContent = data.answer;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
