let baseNumber = 0;

document.getElementById("add").addEventListener("click", function() {
    baseNumber++;
    document.getElementById("number").textContent = baseNumber;
});

document.getElementById("subtract").addEventListener("click", function() {
    baseNumber--;
    document.getElementById("number").textContent = baseNumber;
});

document.getElementById("reset").addEventListener("click", function() {
    baseNumber = 0;
    document.getElementById("number").textContent = baseNumber;
});
