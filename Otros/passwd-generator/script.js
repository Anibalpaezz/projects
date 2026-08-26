// Take advantage of the Web Crypto API for secure random number generation
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@";

// Generate a random integer in the range [0, max)
function getRandomInt(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

// Get a random character from a given charset
function getRandomChar(charset) {
    return charset[getRandomInt(charset.length)];
}

// Shuffle the array using the Fisher-Yates algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a password with the specified number of each character type
function generatePassword(numUppercase, numLowercase, numNumbers, numSymbols) {
    const chars = [];

    // Ensure we have at least one of each type if requested
    for (let i = 0; i < numUppercase; i++) chars.push(getRandomChar(UPPERCASE));
    for (let i = 0; i < numLowercase; i++) chars.push(getRandomChar(LOWERCASE));
    for (let i = 0; i < numNumbers; i++) chars.push(getRandomChar(NUMBERS));
    for (let i = 0; i < numSymbols; i++) chars.push(getRandomChar(SYMBOLS));

    return shuffle(chars).join("");
}

// Handle the button click to generate the password
document.getElementById("generate").addEventListener("click", () => {
    // Get user input values
    const length = parseInt(document.getElementById("length").value);
    const useSymbols = document.getElementById("symbols").checked;
    const useNumbers = document.getElementById("numbers").checked;
    const outputEl = document.getElementById("password");

    // Validate length input
    if (!length || length < 1) return;

    let numUppercase = 0;
    let numLowercase = 0;
    let numNumbers = 0;
    let numSymbols = 0;

    // Distribute character types based on user preferences
    if (useSymbols && useNumbers) {
        numUppercase = Math.floor(length * 0.25);
        numLowercase = Math.floor(length * 0.25);
        numNumbers = Math.floor(length * 0.25);
        numSymbols = length - numUppercase - numLowercase - numNumbers;
    } else if (useSymbols) {
        numUppercase = Math.floor(length * 0.33);
        numLowercase = Math.floor(length * 0.33);
        numSymbols = length - numUppercase - numLowercase;
    } else if (useNumbers) {
        numUppercase = Math.floor(length * 0.33);
        numLowercase = Math.floor(length * 0.33);
        numNumbers = length - numUppercase - numLowercase;
    } else {
        numUppercase = Math.floor(length * 0.5);
        numLowercase = length - numUppercase;
    }

    // Generate and display the password
    outputEl.value = generatePassword(numUppercase, numLowercase, numNumbers, numSymbols);
});
