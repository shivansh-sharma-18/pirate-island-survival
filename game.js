const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// =========================
// World
// =========================

const world = {
    width: 3000,
    height: 2000
};


// =========================
// Island
// =========================

const island = {
    x: 300,
    y: 200
};


// =========================
// Camera
// =========================

const camera = {
    x: 0,
    y: 0
};


// =========================
// Player
// =========================

const player = {
    x: 700,
    y: 700,
    width: 50,
    height: 50,
    speed: 300
};


// =========================
// Keyboard Input
// =========================

const keys = {};

window.addEventListener("keydown", function (event) {
    keys[event.key] = true;
});

window.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});


// =========================
// Create Island Path
// =========================

function createIslandPath() {

    const path = new Path2D();

    path.moveTo(
        island.x + 300,
        island.y
    );

    path.quadraticCurveTo(
        island.x + 550,
        island.y - 100,
        island.x + 800,
        island.y + 100
    );

    path.quadraticCurveTo(
        island.x + 1050,
        island.y + 200,
        island.x + 1100,
        island.y + 500
    );

    path.quadraticCurveTo(
        island.x + 1050,
        island.y + 800,
        island.x + 900,
        island.y + 1000
    );

    path.quadraticCurveTo(
        island.x + 750,
        island.y + 1250,
        island.x + 500,
        island.y + 1400
    );

    path.quadraticCurveTo(
        island.x + 250,
        island.y + 1350,
        island.x + 100,
        island.y + 1200
    );

    path.quadraticCurveTo(
        island.x - 100,
        island.y + 950,
        island.x,
        island.y + 700
    );

    path.quadraticCurveTo(
        island.x,
        island.y + 450,
        island.x + 100,
        island.y + 300
    );

    path.quadraticCurveTo(
        island.x + 150,
        island.y + 100,
        island.x + 300,
        island.y
    );

    path.closePath();

    return path;
}


// Create the island path once

const islandPath = createIslandPath();


// =========================
// Island Collision
// =========================

function isInsideIsland(x, y) {

    return ctx.isPointInPath(
        islandPath,
        x,
        y
    );
}


// Check player's center

function isPlayerOnIsland(x, y) {

    const centerX = x + player.width / 2;
    const centerY = y + player.height / 2;

    return isInsideIsland(centerX, centerY);
}


// =========================
// Update Game State
// =========================

function update(dt) {

    // -------------------------
    // Player movement
    // -------------------------

    if (keys["w"]) {

        const newY =
            player.y - player.speed * dt;

        if (isPlayerOnIsland(player.x, newY)) {
            player.y = newY;
        }
    }


    if (keys["s"]) {

        const newY =
            player.y + player.speed * dt;

        if (isPlayerOnIsland(player.x, newY)) {
            player.y = newY;
        }
    }


    if (keys["a"]) {

        const newX =
            player.x - player.speed * dt;

        if (isPlayerOnIsland(newX, player.y)) {
            player.x = newX;
        }
    }


    if (keys["d"]) {

        const newX =
            player.x + player.speed * dt;

        if (isPlayerOnIsland(newX, player.y)) {
            player.x = newX;
        }
    }


    // -------------------------
    // Keep player inside world
    // -------------------------

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > world.width) {
        player.x = world.width - player.width;
    }

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.y + player.height > world.height) {
        player.y = world.height - player.height;
    }


    // -------------------------
    // Update camera
    // -------------------------

    camera.x =
        player.x -
        canvas.width / 2 +
        player.width / 2;

    camera.y =
        player.y -
        canvas.height / 2 +
        player.height / 2;


    // -------------------------
    // Keep camera inside world
    // -------------------------

    camera.x = Math.max(
        0,
        Math.min(
            camera.x,
            world.width - canvas.width
        )
    );

    camera.y = Math.max(
        0,
        Math.min(
            camera.y,
            world.height - canvas.height
        )
    );
}


// =========================
// Draw Game
// =========================

function draw() {

    // -------------------------
    // Clear canvas
    // -------------------------

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // -------------------------
    // Draw water
    // -------------------------

    ctx.fillStyle = "lightblue";

    ctx.fillRect(
        -camera.x,
        -camera.y,
        world.width,
        world.height
    );


    // -------------------------
    // Draw island
    // -------------------------

    ctx.fillStyle = "sandybrown";

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

    ctx.fill(islandPath);

    ctx.restore();


    // -------------------------
    // Draw player
    // -------------------------

    ctx.fillStyle = "green";

    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}


// =========================
// Game Loop
// =========================

let lastTime = 0;

function gameLoop(timestamp) {

    if (lastTime === 0) {
        lastTime = timestamp;
    }

    const dt =
        (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    update(dt);

    draw();

    requestAnimationFrame(gameLoop);
}


// =========================
// Start Game
// =========================

requestAnimationFrame(gameLoop);