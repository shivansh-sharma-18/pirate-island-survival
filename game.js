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
// Trees
// =========================

const trees = [
    {
        x: 600,
        y: 500,
        width: 60,
        height: 100
    },
    {
        x: 900,
        y: 700,
        width: 60,
        height: 100
    },
    {
        x: 500,
        y: 1000,
        width: 60,
        height: 100
    },
    {
        x: 1000,
        y: 1100,
        width: 60,
        height: 100
    }
];


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


// Create island path once

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


// Check if entire player is on island

function isPlayerOnIsland(x, y) {

    const topLeft = isInsideIsland(
        x,
        y
    );

    const topRight = isInsideIsland(
        x + player.width,
        y
    );

    const bottomLeft = isInsideIsland(
        x,
        y + player.height
    );

    const bottomRight = isInsideIsland(
        x + player.width,
        y + player.height
    );

    return (
        topLeft &&
        topRight &&
        bottomLeft &&
        bottomRight
    );
}


// =========================
// Rectangle Collision
// =========================

function rectanglesOverlap(rect1, rect2) {

    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}


// =========================
// Tree Collision
// =========================

function isCollidingWithTree(x, y) {

    const futurePlayer = {
        x: x,
        y: y,
        width: player.width,
        height: player.height
    };

    for (const tree of trees) {

        if (rectanglesOverlap(futurePlayer, tree)) {
            return true;
        }
    }

    return false;
}


// =========================
// Update Game State
// =========================

function update(dt) {

    // -------------------------
    // Player movement
    // -------------------------

    // Move up

    if (keys["w"]) {

        const newY =
            player.y - player.speed * dt;

        if (
            isPlayerOnIsland(player.x, newY) &&
            !isCollidingWithTree(player.x, newY)
        ) {
            player.y = newY;
        }
    }


    // Move down

    if (keys["s"]) {

        const newY =
            player.y + player.speed * dt;

        if (
            isPlayerOnIsland(player.x, newY) &&
            !isCollidingWithTree(player.x, newY)
        ) {
            player.y = newY;
        }
    }


    // Move left

    if (keys["a"]) {

        const newX =
            player.x - player.speed * dt;

        if (
            isPlayerOnIsland(newX, player.y) &&
            !isCollidingWithTree(newX, player.y)
        ) {
            player.x = newX;
        }
    }


    // Move right

    if (keys["d"]) {

        const newX =
            player.x + player.speed * dt;

        if (
            isPlayerOnIsland(newX, player.y) &&
            !isCollidingWithTree(newX, player.y)
        ) {
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
// Draw Tree
// =========================

function drawTree(tree) {

    // Tree trunk

    ctx.fillStyle = "saddlebrown";

    ctx.fillRect(
        tree.x - camera.x + 20,
        tree.y - camera.y + 40,
        20,
        60
    );


    // Tree leaves

    ctx.fillStyle = "darkgreen";

    ctx.beginPath();

    ctx.arc(
        tree.x - camera.x + 30,
        tree.y - camera.y + 30,
        35,
        0,
        Math.PI * 2
    );

    ctx.fill();
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
    // Draw trees
    // -------------------------

    for (const tree of trees) {
        drawTree(tree);
    }


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