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

// Collision checker
function checkCollide() {
  const ballCenterX = ballCurrentPosition[0] + ballDiameter / 2;
  const ballCenterY = ballCurrentPosition[1] + ballDiameter / 2;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (
      ballCurrentPosition[0] + ballDiameter > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      score++;
      scoreDisplay.innerHTML = score;

      // Check if the collision is on the top or bottom of the block
      const isBallAboveBlock =
        ballCurrentPosition[1] + ballDiameter - yDirection <
        block.bottomLeft[1];
      const isBallBelowBlock =
        ballCurrentPosition[1] - yDirection > block.topLeft[1];
      const isBallLeftOfBlock =
        ballCurrentPosition[0] + ballDiameter - xDirection <
        block.bottomLeft[0];
      const isBallRightOfBlock =
        ballCurrentPosition[0] - xDirection > block.bottomRight[0];

      // Change ball direction based on the collision side
      if (isBallAboveBlock || isBallBelowBlock) {
        yDirection *= -1;
      }
      if (isBallLeftOfBlock || isBallRightOfBlock) {
        xDirection *= -1;
      }

      // Prevent the ball from getting stuck by adjusting its position
      if (isBallAboveBlock) {
        ballCurrentPosition[1] = block.bottomLeft[1] - ballDiameter;
      } else if (isBallBelowBlock) {
        ballCurrentPosition[1] = block.topLeft[1];
      }
      if (isBallLeftOfBlock) {
        ballCurrentPosition[0] = block.bottomLeft[0] - ballDiameter;
      } else if (isBallRightOfBlock) {
        ballCurrentPosition[0] = block.bottomRight[0];
      }

      break;
    }
  }

  // Check for wall collisions
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

  // Check for user collisions
  if (
    ballCurrentPosition[0] + ballDiameter > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] + ballDiameter > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    yDirection *= -1;

    // Adjust ball position to prevent getting stuck
    ballCurrentPosition[1] = currentPosition[1] + blockHeight + 1;
  }

  // Check for game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = 'YOU LOSE';
    document.removeEventListener('keydown', moveUser);
  }

  // Check for game win
  if (blocks.length === 0) {
    scoreDisplay.innerHTML = 'YOU WIN';
    clearInterval(timerId);
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
