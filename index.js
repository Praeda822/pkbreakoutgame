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

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

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

// Add my blocks
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

// Draw user
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

// Draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Moving user
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

document.addEventListener('keydown', moveUser);

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// Move Ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkCollide();
}

timerId = setInterval(moveBall, 30);

// Collision checker
function checkCollide() {
  // Check for ball center
  const ballCenterX = ballCurrentPosition[0] + ballDiameter / 2;
  const ballCenterY = ballCurrentPosition[1] + ballDiameter / 2;

  // Check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      // Check for block collisions on CORNERS
      const corners = [
        blocks[i].bottomLeft,
        blocks[i].bottomRight,
        blocks[i].topLeft,
        blocks[i].topRight,
      ];
      let cornerCollisionDetected = false;

      for (const corner of corners) {
        const distance = Math.sqrt(
          Math.pow(corner[0] - ballCenterX, 2) +
            Math.pow(corner[1] - ballCenterY, 2)
        );
        if (distance < ballDiameter / 2) {
          cornerCollisionDetected = true;
          break;
        }
      }

      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      break;
    }
  }
  // Check for wall collisions
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    console.log('Hoirzontal boing');
    xDirection *= -1;
  }
  if (
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[1] <= 0
  ) {
    console.log('Vertical boing');
    yDirection *= -1;
  }

  // Checks for user collisions
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    console.log('User boing');

    // Ball collision on dodgy corners
    const ballHitPosition = ballCurrentPosition[0] - currentPosition[0];
    // Ensure ball moves left
    if (ballHitPosition < blockWidth / 2) {
      xDirection = -Math.abs(xDirection);
      // Ensure ball moves right
    } else {
      xDirection = Math.abs(xDirection);
    }
    yDirection *= -1;

    // Stop ball getting stuck
    ballCurrentPosition[1] = currentPosition[1] + blockHeight + 1;
  }

  // Checks for game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    console.log('YOU LOSE');
    scoreDisplay.innerHTML = 'YOU LOSE';
    document.removeEventListener('keydown', moveUser);
  }
}

function changeDirection() {
  xDirection *= -1;
  yDirection *= -1;
}
