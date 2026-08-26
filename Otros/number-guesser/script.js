const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('guessButton');
const resultDiv = document.getElementById('result');

let randomNumber = Math.floor(Math.random() * 100) + 1;

submitBtn.addEventListener('click', () => {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        resultDiv.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    if (userGuess === randomNumber) {
        resultDiv.textContent = 'Congratulations! You guessed the number.';
    } else if (userGuess < randomNumber) {
        resultDiv.textContent = 'Too low! Try again.';
    } else {
        resultDiv.textContent = 'Too high! Try again.';
    }
});
