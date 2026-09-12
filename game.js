const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(100, 100, 100, 100);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();