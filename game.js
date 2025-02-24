// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game variables
let bird = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

// Pipe properties
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;

// Input handling for both touch and keyboard
function handleJump() {
    if (!gameOver) {
        bird.velocity = bird.jump;
    }
}

function handleRestart() {
    if (gameOver) {
        resetGame();
    }
}

// Keyboard events
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        handleJump();
    }
    if (event.code === 'Enter') {
        handleRestart();
    }
});

// Touch events
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    handleJump();
}, { passive: false });

canvas.addEventListener('touchend', function(event) {
    event.preventDefault();
    if (gameOver) {
        handleRestart();
    }
}, { passive: false });

// Generate pipes
function generatePipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap
    });
}

// Collision detection
function checkCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        return true;
    }

    for (let pipe of pipes) {
        if (bird.x + bird.width > pipe.x && 
            bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.topHeight || 
                bird.y + bird.height > canvas.height - pipe.bottomHeight) {
                return true;
            }
        }
    }
    return false;
}

// Reset game
function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    frameCount = 0;
}

// Game loop
function gameLoop() {
    // Update
    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (frameCount % 90 === 0) {
            generatePipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;
            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
                score++;
            }
        }

        if (checkCollision()) {
            gameOver = true;
        }

        frameCount++;
    }

    // Draw
    ctx.fillStyle = '#71c5ee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#5c4033';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = 'green';
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, 
            pipeWidth, pipe.bottomHeight);
    }

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width/2 - 100, canvas.height/2);
        ctx.font = '20px Arial';
        ctx.fillText('Tap to Restart', canvas.width/2 - 60, canvas.height/2 + 40);
    }

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
