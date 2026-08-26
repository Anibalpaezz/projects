const DIE_NAMES = ["one", "two", "three", "four", "five", "six"];

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function createDieElement(roll) {
    const die = document.createElement("div");
    die.className = "die";
    die.innerHTML = `
        <img class="diceImage" src="images/dice-${DIE_NAMES[roll - 1]}-solid-full.svg" alt="Dice ${roll}">
        <p>${roll}</p>
    `;
    return die;
}

function rollDice() {
    const diceNum = parseInt(document.getElementById("diceNum").value, 10);

    if (isNaN(diceNum) || diceNum < 1 || diceNum > 25) {
        alert("Introduce un número entre 1 y 25");
        return;
    }

    const container = document.getElementById("diceContainer");
    container.innerHTML = "";

    let sum = 0;
    for (let i = 0; i < diceNum; i++) {
        const roll = rollDie();
        sum += roll;
        container.appendChild(createDieElement(roll));
    }

    console.log("Suma total:", sum);
}

document.getElementById("rollBtn").addEventListener("click", rollDice);
