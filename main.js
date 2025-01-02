// Basic Flappy-Bird-like mechanics using plain JavaScript and Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const duckSize = 32;
const gravity = 0.5;
const jumpForce = -10;
const treeGap = 150; // Opening in the trees
const treeWidth = 50; // Width of the tree obstacles
const treeFrequency = 100; // How often we spawn a new tree (frames)

// Game variables
let duckY = canvas.height / 2;
let duckSpeed = 0;
let frameCount = 0;
let score = 0;

// Store trees as an array of objects
// Each object: { x: number, topHeight: number }
let trees = [];

function drawDuck() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(50, duckY, duckSize, duckSize);
}

function updateDuck() {
  duckSpeed += gravity;
  duckY += duckSpeed;
  // Check if duck hits the ground
  if (duckY + duckSize > canvas.height) {
    resetGame();
  }
}

function spawnTree() {
  const topHeight = Math.floor(Math.random() * (canvas.height - treeGap - 20));
  trees.push({
    x: canvas.width,
    topHeight,
  });
}

function drawTrees() {
  ctx.fillStyle = "green";
  trees.forEach((tree) => {
    // Top tree
    ctx.fillRect(tree.x, 0, treeWidth, tree.topHeight);
    // Bottom tree
    const bottomY = tree.topHeight + treeGap;
    const bottomHeight = canvas.height - bottomY;
    ctx.fillRect(tree.x, bottomY, treeWidth, bottomHeight);
  });
}

function moveTrees() {
  trees.forEach((tree) => {
    tree.x -= 3; // Move tree left
  });

  // Remove trees that go off-screen
  if (trees.length && trees[0].x + treeWidth < 0) {
    trees.shift();
    score++;
  }
}

function checkCollisions() {
  // Duck bounding box
  const duckLeft = 50;
  const duckRight = 50 + duckSize;
  const duckTop = duckY;
  const duckBottom = duckY + duckSize;

  for (const tree of trees) {
    // Tree bounding boxes
    const treeLeft = tree.x;
    const treeRight = tree.x + treeWidth;
    const topTreeBottom = tree.topHeight;
    const bottomTreeTop = tree.topHeight + treeGap;

    if (
      duckRight > treeLeft &&
      duckLeft < treeRight &&
      (duckTop < topTreeBottom || duckBottom > bottomTreeTop)
    ) {
      // Collision with a tree
      resetGame();
      break;
    }
  }
}

function resetGame() {
  alert(`Game Over! Your score was: ${score}`);
  duckY = canvas.height / 2;
  duckSpeed = 0;
  trees = [];
  frameCount = 0;
  score = 0;
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spawn a new tree every X frames
  if (frameCount % treeFrequency === 0) {
    spawnTree();
  }

  drawDuck();
  updateDuck();

  drawTrees();
  moveTrees();
  checkCollisions();

  frameCount++;
}

function flap() {
  duckSpeed = jumpForce;
}

// Event listener to make duck jump on spacebar
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    flap();
  }
});

// Start the game
gameLoop();
