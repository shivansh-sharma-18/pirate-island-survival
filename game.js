const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Player
const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 300
};


// Keyboard input
const keys = {};

window.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

window.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});


// Update game state
function update(dt) {

    if (keys["w"]) {
        player.y -= player.speed * dt;
    }

    if (keys["s"]) {
        player.y += player.speed * dt;
    }

    if (keys["a"]) {
        player.x -= player.speed * dt;
    }

    if (keys["d"]) {
        player.x += player.speed * dt;
    }


    // Keep player inside the canvas

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}


// Draw game
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}


// Game loop
let lastTime = 0;

function gameLoop(timestamp) {

    if (lastTime === 0) {
        lastTime = timestamp;
    }

    const dt = (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();