// Basic Flappy-Bird-like mechanics using plain JavaScript and Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas to the window size at load
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// You can also update your game constants if you want them relative to window size,
// or handle window resizing like so:
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Game constants
const duckSize = 32;
const gravity = 0.5;
const jumpForce = -10;
const treeGap = 150; // Opening in the trees
const treeWidth = 50; // Width of the tree obstacles
const treeFrequency = 100; // How often we spawn a new tree (frames)

// 1) Load images for the duck and the tree (placeholder images shown here)
const duckImg = new Image();
duckImg.src = 'images/duck.webp';
const treeImg = new Image();
treeImg.src = 'images/tree.webp';

// Flag to track whether the user has started the game
let gameStarted = false;
// Time until which collisions are ignored (in ms)
let invincibleUntil = 0;

// Game variables
let duckY = canvas.height / 2;
let duckSpeed = 0;
let frameCount = 0;
let score = 0;

// Store trees as an array of objects
// Each object: { x: number, topHeight: number }
let trees = [];

// Show instructions on the canvas
function drawInstructions() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Tap or press SPACE to flap. Avoid the trees!", 20, canvas.height / 2);
}

function drawDuck() {
  // Use an image instead of a yellow rectangle
  ctx.drawImage(duckImg, 50, duckY, duckSize, duckSize);
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

// Modify drawTrees to use the tree image
function drawTrees() {
  trees.forEach((tree) => {
    // Save the current context state
    ctx.save();
    
    // Draw the top tree (flipped)
    ctx.translate(tree.x, tree.topHeight);
    ctx.scale(1, -1);
    ctx.drawImage(treeImg, 0, 0, treeWidth, tree.topHeight);
    
    // Restore context for bottom tree
    ctx.restore();
    
    // Draw the bottom tree normally
    const bottomY = tree.topHeight + treeGap;
    const bottomHeight = canvas.height - bottomY;
    ctx.drawImage(treeImg, tree.x, bottomY, treeWidth, bottomHeight);
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
  // Skip collision checks if we're still within the invincibility window
  if (performance.now() < invincibleUntil) {
    return;
  }

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
  gameStarted = false;
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    // Show instructions until the user starts the game
    drawInstructions();
  } else {
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
}

function flap() {
  if (!gameStarted) {
    gameStarted = true;
    // Set 3-second grace period
    invincibleUntil = performance.now() + 500;
  }
  duckSpeed = jumpForce;
}

// Handle both keyboard and touch/click events
function handleFlap(event) {
    // Prevent default behavior for touch events
    if (event.type === 'touchstart') {
        event.preventDefault();
    }
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        score = 0;
        trees = [];
    }
    if (!gameOver) {
        duckSpeed = jumpForce;
    }
}

// Add multiple event listeners
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        handleFlap(e);
    }
});

// Start the game
gameLoop();
