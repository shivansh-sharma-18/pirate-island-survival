const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ======================================================
// WORLD
// ======================================================

const world = {
  width: 3000,
  height: 2000,
};

// ======================================================
// CAMERA
// ======================================================

const camera = {
  x: 0,
  y: 0,
};

// ======================================================
// PLAYER
// ======================================================

const player = {
  x: 700,
  y: 700,

  // Collision box
  width: 50,
  height: 50,

  // Sprite size
  spriteWidth: 70,
  spriteHeight: 70,

  speed: 300,

  // Player aiming angle
  aimAngle: 0,

  // Current weapon
  weapon: "gun",
};

// ======================================================
// PLAYER IMAGE
// ======================================================

const playerImage = new Image();

playerImage.src = "assets/player/rotation_pose_set/manBlue_stand.png";

// ======================================================
// PLAYER GUN IMAGE
// ======================================================

const playerGunImage = new Image();

playerGunImage.src = "assets/player/rotation_pose_set/manBlue_gun.png";

// ======================================================
// TERRAIN IMAGES
// ======================================================

const terrainImages = {};

// Only THREE terrain types for now:
// Water
// Sand
// Grass

const terrainFiles = {
  water: "assets/environment/water/rpgpack_rpgTile013.png",

  sand: "assets/environment/terrain/tile_18.png",

  grass: "assets/environment/terrain/tile_39.png",
};

// Load terrain images

for (const [name, path] of Object.entries(terrainFiles)) {
  const image = new Image();

  image.src = path;

  terrainImages[name] = image;
}

// ======================================================
// TERRAIN SETTINGS
// ======================================================

const TILE_SIZE = 64;

// ======================================================
// TERRAIN MAP
// ======================================================
//
// W = Water
// S = Sand
// G = Grass
//
// For now we deliberately use only
// one image for each terrain type.
// ======================================================

const terrainMap = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWSSSSSSWWWWWWWWWW",
  "WWWWWWWWWWWWWSSSSSSSSSSSSWWWWWWW",
  "WWWWWWWWWWWSSSSSSSSSSSSSSSSWWWW",
  "WWWWWWWWWSSSSSSGGGGSSSSSSSSSWWW",
  "WWWWWWSSSSSSGGGGGGGGGGSSSSSSSWW",
  "WWWWWSSSSGGGGGGGGGGGGGGSSSSSSWW",
  "WWWWSSSSGGGGGGGGGGGGGGGGSSSSSWW",
  "WWWSSSSGGGGGGGGGGGGGGGGGGSSSSWW",
  "WWSSSSGGGGGGGGGGGGGGGGGGGGSSSSW",
  "WWSSSGGGGGGGGGGGGGGGGGGGGGSSSSW",
  "WSSSSGGGGGGGGGGGGGGGGGGGGGGSSSW",
  "WSSSGGGGGGGGGGGGGGGGGGGGGGGSSSW",
  "WSSSGGGGGGGGGGGGGGGGGGGGGGSSSSW",
  "WSSSSGGGGGGGGGGGGGGGGGGGGGGSSSW",
  "WWSSSGGGGGGGGGGGGGGGGGGGGGSSSSW",
  "WWSSSSGGGGGGGGGGGGGGGGGGGGSSSSW",
  "WWWSSSSGGGGGGGGGGGGGGGGGGSSSSWW",
  "WWWWSSSSGGGGGGGGGGGGGGGGSSSSWWW",
  "WWWWSSSSSSGGGGGGGGGGGGGGSSSSWWW",
  "WWWWWSSSSSSGGGGGGGGGGGGSSSSWWWW",
  "WWWWWWSSSSSSGGGGGGGGGGSSSSWWWWW",
  "WWWWWWWSSSSSSSSGGGGSSSSSSSWWWWW",
  "WWWWWWWWSSSSSSSSSSSSSSSSSWWWWW",
  "WWWWWWWWWWSSSSSSSSSSSSSSWWWWWW",
  "WWWWWWWWWWWWSSSSSSSSSSWWWWWWWW",
  "WWWWWWWWWWWWWWSSSSSSWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
];

// ======================================================
// TREE IMAGE
// ======================================================

const treeImage = new Image();

treeImage.src = "assets/environment/vegetation/palm_detailed_long.png";

// ======================================================
// ROCK IMAGE
// ======================================================

const rockImage = new Image();

rockImage.src = "assets/environment/rocks/formation_rock.png";

// ======================================================
// TREES
// ======================================================

const trees = [
  {
    x: 600,
    y: 500,

    width: 100,
    height: 150,

    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 900,
    y: 700,

    width: 100,
    height: 150,

    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 500,
    y: 1000,

    width: 100,
    height: 150,

    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 1000,
    y: 1100,

    width: 100,
    height: 150,

    collisionWidth: 30,
    collisionHeight: 35,
  },
];

// ======================================================
// ROCKS
// ======================================================

const rocks = [
  {
    x: 800,
    y: 450,

    width: 80,
    height: 60,

    collisionWidth: 60,
    collisionHeight: 40,
  },

  {
    x: 1100,
    y: 800,

    width: 90,
    height: 65,

    collisionWidth: 70,
    collisionHeight: 45,
  },

  {
    x: 700,
    y: 1200,

    width: 75,
    height: 55,

    collisionWidth: 55,
    collisionHeight: 35,
  },
];

// ======================================================
// MOUSE
// ======================================================

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// ======================================================
// KEYBOARD INPUT
// ======================================================

const keys = {};

window.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  keys[key] = true;

  // Prevent browser scrolling

  if (
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d" ||
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright"
  ) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", function (event) {
  const key = event.key.toLowerCase();

  keys[key] = false;
});

// ======================================================
// MOUSE MOVEMENT
// ======================================================

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();

  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

// ======================================================
// TERRAIN HELPER
// ======================================================

function getTerrainTile(row, col) {
  // Outside map = water

  if (
    row < 0 ||
    row >= terrainMap.length ||
    col < 0 ||
    col >= terrainMap[row].length
  ) {
    return "W";
  }

  return terrainMap[row][col];
}

// ======================================================
// CHECK IF TERRAIN IS WALKABLE
// ======================================================

function isWalkable(x, y) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);

  const tile = getTerrainTile(row, col);

  // Only sand and grass are walkable

  return tile === "S" || tile === "G";
}

// ======================================================
// PLAYER TERRAIN COLLISION
// ======================================================

function isPlayerOnIsland(x, y) {
  const topLeft = isWalkable(x, y);

  const topRight = isWalkable(x + player.width - 1, y);

  const bottomLeft = isWalkable(x, y + player.height - 1);

  const bottomRight = isWalkable(x + player.width - 1, y + player.height - 1);

  return topLeft && topRight && bottomLeft && bottomRight;
}

// ======================================================
// RECTANGLE COLLISION
// ======================================================

function rectanglesOverlap(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// ======================================================
// TREE COLLISION
// ======================================================

function isCollidingWithTree(x, y) {
  const futurePlayer = {
    x: x,
    y: y,

    width: player.width,
    height: player.height,
  };

  for (const tree of trees) {
    const treeCollisionBox = {
      x: tree.x + (tree.width - tree.collisionWidth) / 2,

      y: tree.y + tree.height - tree.collisionHeight,

      width: tree.collisionWidth,

      height: tree.collisionHeight,
    };

    if (rectanglesOverlap(futurePlayer, treeCollisionBox)) {
      return true;
    }
  }

  return false;
}

// ======================================================
// ROCK COLLISION
// ======================================================

function isCollidingWithRock(x, y) {
  const futurePlayer = {
    x: x,
    y: y,

    width: player.width,
    height: player.height,
  };

  for (const rock of rocks) {
    const rockCollisionBox = {
      x: rock.x + (rock.width - rock.collisionWidth) / 2,

      y: rock.y + (rock.height - rock.collisionHeight) / 2,

      width: rock.collisionWidth,

      height: rock.collisionHeight,
    };

    if (rectanglesOverlap(futurePlayer, rockCollisionBox)) {
      return true;
    }
  }

  return false;
}

// ======================================================
// ENVIRONMENT COLLISION
// ======================================================

function isCollidingWithEnvironment(x, y) {
  return isCollidingWithTree(x, y) || isCollidingWithRock(x, y);
}

// ======================================================
// TRY MOVE PLAYER
// ======================================================

function tryMove(newX, newY) {
  // First check terrain

  if (!isPlayerOnIsland(newX, newY)) {
    return false;
  }

  // Then check trees and rocks

  if (isCollidingWithEnvironment(newX, newY)) {
    return false;
  }

  player.x = newX;
  player.y = newY;

  return true;
}

// ======================================================
// UPDATE GAME
// ======================================================

function update(dt) {
  // Prevent huge movement if browser lags

  dt = Math.min(dt, 0.05);

  const movement = player.speed * dt;

  // ====================================================
  // PLAYER AIMING
  // ====================================================

  // Convert mouse position from screen coordinates
  // into world coordinates.

  const mouseWorldX = mouse.x + camera.x;
  const mouseWorldY = mouse.y + camera.y;

  // Player center

  const playerCenterX = player.x + player.width / 2;

  const playerCenterY = player.y + player.height / 2;

  // Calculate angle from player to mouse

  player.aimAngle = Math.atan2(
    mouseWorldY - playerCenterY,
    mouseWorldX - playerCenterX,
  );

  // ====================================================
  // MOVEMENT
  // ====================================================

  if (keys["w"] || keys["arrowup"]) {
    tryMove(player.x, player.y - movement);
  }

  if (keys["s"] || keys["arrowdown"]) {
    tryMove(player.x, player.y + movement);
  }

  if (keys["a"] || keys["arrowleft"]) {
    tryMove(player.x - movement, player.y);
  }

  if (keys["d"] || keys["arrowright"]) {
    tryMove(player.x + movement, player.y);
  }

  // ====================================================
  // WORLD BOUNDS
  // ====================================================

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

  // ====================================================
  // CAMERA FOLLOW
  // ====================================================

  camera.x = player.x - canvas.width / 2 + player.width / 2;

  camera.y = player.y - canvas.height / 2 + player.height / 2;

  // ====================================================
  // CAMERA WORLD BOUNDS
  // ====================================================

  camera.x = Math.max(0, Math.min(camera.x, world.width - canvas.width));

  camera.y = Math.max(0, Math.min(camera.y, world.height - canvas.height));
}

// ======================================================
// DRAW TREE
// ======================================================

function drawTree(tree) {
  const screenX = tree.x - camera.x;

  const screenY = tree.y - camera.y;

  // Don't draw if completely
  // outside screen

  if (
    screenX + tree.width < 0 ||
    screenX > canvas.width ||
    screenY + tree.height < 0 ||
    screenY > canvas.height
  ) {
    return;
  }

  if (treeImage.complete) {
    ctx.drawImage(treeImage, screenX, screenY, tree.width, tree.height);
  }
}

// ======================================================
// DRAW ROCK
// ======================================================

function drawRock(rock) {
  const screenX = rock.x - camera.x;

  const screenY = rock.y - camera.y;

  // Don't draw if completely
  // outside screen

  if (
    screenX + rock.width < 0 ||
    screenX > canvas.width ||
    screenY + rock.height < 0 ||
    screenY > canvas.height
  ) {
    return;
  }

  if (rockImage.complete) {
    ctx.drawImage(rockImage, screenX, screenY, rock.width, rock.height);
  }
}

// ======================================================
// DRAW PLAYER
// ======================================================

function drawPlayer() {
  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;

  // Choose the correct player image

  const currentImage = player.weapon === "gun" ? playerGunImage : playerImage;

  if (currentImage.complete && currentImage.naturalWidth > 0) {
  const drawX = screenX - (player.spriteWidth - player.width) / 2;

  const drawY = screenY - (player.spriteHeight - player.height);

  const centerX = drawX + player.spriteWidth / 2;

  const centerY = drawY + player.spriteHeight / 2;

  ctx.save();

  ctx.translate(centerX, centerY);

  ctx.rotate(player.aimAngle);

  ctx.drawImage(
    currentImage,
    -player.spriteWidth / 2,
    -player.spriteHeight / 2,
    player.spriteWidth,
    player.spriteHeight
  );

  ctx.restore();
} else {
    // Temporary fallback

    ctx.fillStyle = "green";

    ctx.fillRect(screenX, screenY, player.width, player.height);
  }
}

// ======================================================
// TERRAIN IMAGE
// ======================================================

function getTerrainImage(row, col) {
  const tile = getTerrainTile(row, col);

  if (tile === "W") {
    return terrainImages.water;
  }

  if (tile === "S") {
    return terrainImages.sand;
  }

  if (tile === "G") {
    return terrainImages.grass;
  }

  return null;
}

// ======================================================
// DRAW TERRAIN
// ======================================================

function drawTerrain() {
  // Only draw visible columns

  const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE) - 1);

  const endCol = Math.min(
    terrainMap[0].length,
    Math.ceil((camera.x + canvas.width) / TILE_SIZE) + 1,
  );

  // Only draw visible rows

  const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE) - 1);

  const endRow = Math.min(
    terrainMap.length,
    Math.ceil((camera.y + canvas.height) / TILE_SIZE) + 1,
  );

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const image = getTerrainImage(row, col);

      if (!image || !image.complete) {
        continue;
      }

      const worldX = col * TILE_SIZE;

      const worldY = row * TILE_SIZE;

      const screenX = worldX - camera.x;

      const screenY = worldY - camera.y;

      ctx.drawImage(
        image,

        screenX,
        screenY,

        TILE_SIZE,
        TILE_SIZE,
      );
    }
  }
}

// ======================================================
// DRAW GAME
// ======================================================

function draw() {
  // ====================================================
  // CLEAR SCREEN
  // ====================================================

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ====================================================
  // WATER BACKGROUND
  // ====================================================

  ctx.fillStyle = "#8fd3e6";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ====================================================
  // TERRAIN
  // ====================================================

  drawTerrain();

  // ====================================================
  // ENVIRONMENT
  // ====================================================

  for (const tree of trees) {
    drawTree(tree);
  }

  for (const rock of rocks) {
    drawRock(rock);
  }

  // ====================================================
  // PLAYER
  // ====================================================

  drawPlayer();
}

// ======================================================
// WINDOW RESIZE
// ======================================================

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ======================================================
// GAME LOOP
// ======================================================

let lastTime = 0;

function gameLoop(timestamp) {
  if (lastTime === 0) {
    lastTime = timestamp;
  }

  let dt = (timestamp - lastTime) / 1000;

  lastTime = timestamp;

  update(dt);

  draw();

  requestAnimationFrame(gameLoop);
}

// ======================================================
// START GAME
// ======================================================

requestAnimationFrame(gameLoop);
