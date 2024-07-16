'use strict';

const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

/**
 * Represents a block in the game.
 * @class
 */
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

/**
 * Array of Block objects representing the game blocks.
 * @type {Block[]}
 */
const blocks = [
  // x axis top row
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  // y axis upper-middle row
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  // y axis lower-middle row
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

/**
 * Draws the user on the screen at the current position.
 */
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

/**
 * Draws the ball on the screen at the current position.
 */
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

/**
 * Moves the user based on the key pressed.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) currentPosition[0] -= 10;
      drawUser();
      break;

    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - blockWidth)
        currentPosition[0] += 10;
      drawUser();
      break;
  }
}

/**
 * Moves the ball by updating its current position and then calls the drawBall() & checkCollide() functions respectively to draw the ball and check for collisions.
 */
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkCollide();
}

/**
 * Creates and appends blocks to the grid.
 */
const mkBlocks = function () {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = blocks[i].bottomLeft[0] + 'px';
    block.style.bottom = blocks[i].bottomLeft[1] + 'px';
    grid.appendChild(block);
  }
};
mkBlocks();

// Adding user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

document.addEventListener('keydown', moveUser);

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

timerId = setInterval(moveBall, 30);

function checkCollide() {
  checkBlockCollisions();
  checkWallCollisions();
  checkUserCollision();
  checkGameOver();
}

/**
 * Handles collision between the ball and blocks.
 */
function checkBlockCollisions() {
  for (let index = blocks.length - 1; index >= 0; index--) {
    const block = blocks[index];
    if (isColliding(ballCurrentPosition, block)) {
      blocks.splice(index, 1); // Removes block from array
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      document.querySelector(`.block[data-index="${index}"]`).remove(); // Remove block from DOM
    }
  }
}

/**
 * Determines if the ball is colliding with a given block.
 * @param {Array} ballPosition - The current position of the ball.
 * @param {Block} block - The block to check for a collision.
 * @returns {boolean} True if there is a collision, false otherwise.
 */
function isColliding(ballPosition, block) {
  const [ballX, ballY] = ballPosition;
  const withinXBounds =
    ballX > block.bottomLeft[0] && ballX < block.bottomRight[0];
  const withinYBounds = ballY > block.bottomLeft[1] && ballY < block.topLeft[1];
  return withinXBounds && withinYBounds;
}

/**
 * Checks for collisions between the ball and the walls.
 */
function checkWallCollisions() {
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    xDirection *= -1;
  }
  if (
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[1] <= 0
  ) {
    yDirection *= -1;
  }
}

/**
 * Checks for a collision between the ball and the user.
 */
function checkUserCollision() {
  if (
    isColliding(ballCurrentPosition, {
      bottomLeft: currentPosition,
      bottomRight: [currentPosition[0] + blockWidth, currentPosition[1]],
      topLeft: [currentPosition[0], currentPosition[1] + blockHeight],
      topRight: [
        currentPosition[0] + blockWidth,
        currentPosition[1] + blockHeight,
      ],
    })
  ) {
    changeDirection();
  }
}

/**
 * Checks if the game is over (ball hits the bottom of the screen).
 */
function checkGameOver() {
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    console.log('YOU LOSE');
    scoreDisplay.innerHTML = 'YOU LOSE';
    document.removeEventListener('keydown', moveUser);
  }
}

/**
 * Reverses the direction of the ball using inversion.
 */
function changeDirection() {
  xDirection *= -1;
  yDirection *= -1;
}
