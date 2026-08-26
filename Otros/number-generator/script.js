document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const resultDiv = document.getElementById('number');

    generateBtn.addEventListener('click', function() {
        const randomNum = Math.floor(Math.random() * 100) + 1;
        resultDiv.textContent = randomNum;
    });
});
