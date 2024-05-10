const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15; // Start in the middle of the grid
let velocityX = 0, velocityY = 0;
let snakeBody = [[15, 15]]; // Initial position of the snake
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const moveSound = document.getElementById('moveSound');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    let foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridArea = `${foodY} / ${foodX}`;
    playBoard.appendChild(foodElement);
}

function updateGameElements() {
    playBoard.innerHTML = ''; // Clear the play board

    // Create and place food
    let foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridArea = `${foodY} / ${foodX}`;
    playBoard.appendChild(foodElement);

    // Update and place snake body
    snakeBody.forEach((segment, index) => {
        let segmentElement = document.createElement('div');
        segmentElement.classList.add(index === 0 ? 'head' : 'body');
        segmentElement.style.gridArea = `${segment[0]} / ${segment[1]}`;
        playBoard.appendChild(segmentElement);
    });
}

function gameLoop() {
    if(gameOver) {
        handleGameOver();
        return;
    }

    // Move the snake by updating the head's position
    snakeX += velocityX;
    snakeY += velocityY;

    // Check for collisions with the wall
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30 || snakeBody.some((segment, idx) => idx !== 0 && segment[0] === snakeY && segment[1] === snakeX)) {
        gameOver = true;
        handleGameOver();
        return;
    }

    // Add new head to the snake body
    snakeBody.unshift([snakeY, snakeX]);

    if (snakeX === foodX && snakeY === foodY) {
        score++;
        eatSound.play();
        updateFoodPosition();
    } else {
        snakeBody.pop(); // Remove the tail
    }

    updateGameElements();
    scoreElement.innerText = `Score: ${score}`;
    highScore = Math.max(score, highScore);
    localStorage.setItem("high-score", highScore);
    highScoreElement.innerText = `High Score: ${highScore}`;
}

function handleGameOver() {
    clearInterval(setIntervalId);  // Stop the game loop
    gameOverSound.play();  // Play the game over sound if loaded

    // Clear the play board and display the game over message
    playBoard.innerHTML = '';  // Clear existing elements

    const gameOverText = document.createElement('div');
    gameOverText.className = 'game-over';
    gameOverText.textContent = 'Game Over! Click here to replay...';
    gameOverText.style.cursor = 'pointer';
    gameOverText.addEventListener('click', () => location.reload());  // Reload the game on click

    playBoard.appendChild(gameOverText);  // Add the game over text to the play board
}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && !gameOver) {
        moveSound.play();
        const direction = e.key.replace('Arrow', '').toLowerCase();
        if (direction === "up" && velocityY === 0) {
            velocityX = 0;
            velocityY = -1;
        } else if (direction === "down" && velocityY === 0) {
            velocityX = 0;
            velocityY = 1;
        } else if (direction === "left" && velocityX === 0) {
            velocityX = -1;
            velocityY = 0;
        } else if (direction === "right" && velocityX === 0) {
            velocityX = 1;
            velocityY = 0;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateFoodPosition();
    setIntervalId = setInterval(gameLoop, 100);
});
