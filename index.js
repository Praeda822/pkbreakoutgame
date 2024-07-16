'use strict';

class BreakoutGame {
  constructor(gridSelector, scoreSelector, levelSelector) {
    this.grid = document.querySelector(gridSelector);
    this.scoreDisplay = document.querySelector(scoreSelector);
    this.levelDisplay = document.querySelector(levelSelector);

    this.blockWidth = 100;
    this.blockHeight = 20;
    this.ballDiameter = 20;
    this.boardWidth = 560;
    this.boardHeight = 300;

    this.timerId = null;
    this.xDirection = 2;
    this.yDirection = 2;
    this.score = 0;
    this.level = 1;
    this.ballSpeed = 8;
    this.userSpeed = 25;

    this.userStart = [230, 10];
    this.currentPosition = [...this.userStart];

    this.ballStart = [270, 40];
    this.ballCurrentPosition = [...this.ballStart];

    this.blocks = this.createBlocks();

    this.user = document.createElement('div');
    this.user.classList.add('user');
    this.grid.appendChild(this.user);

    this.ball = document.createElement('div');
    this.ball.classList.add('ball');
    this.grid.appendChild(this.ball);

    document.addEventListener('keydown', this.moveUser.bind(this));
    this.startGame();
  }

  createBlocks() {
    return [
      new Block(10, 270),
      //   new Block(120, 270),
      //   new Block(230, 270),
      //   new Block(340, 270),
      //   new Block(450, 270),
      //   new Block(10, 240),
      //   new Block(120, 240),
      //   new Block(230, 240),
      //   new Block(340, 240),
      //   new Block(450, 240),
      //   new Block(10, 210),
      //   new Block(120, 210),
      //   new Block(230, 210),
      //   new Block(340, 210),
      //   new Block(450, 210),
    ];
  }

  drawUser() {
    this.user.style.left = this.currentPosition[0] + 'px';
    this.user.style.bottom = this.currentPosition[1] + 'px';
  }

  drawBall() {
    this.ball.style.left = this.ballCurrentPosition[0] + 'px';
    this.ball.style.bottom = this.ballCurrentPosition[1] + 'px';
  }

  mkBlocks() {
    this.grid.innerHTML = ''; // Clear existing blocks and user, ball
    for (let i = 0; i < this.blocks.length; i++) {
      const block = document.createElement('div');
      block.classList.add('block');
      block.style.left = this.blocks[i].bottomLeft[0] + 'px';
      block.style.bottom = this.blocks[i].bottomLeft[1] + 'px';
      this.grid.appendChild(block);
    }
    this.grid.appendChild(this.user); // Re-append the user
    this.grid.appendChild(this.ball); // Re-append the ball
    this.drawUser();
    this.drawBall();
  }

  moveUser(e) {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.currentPosition[0] > 0)
          this.currentPosition[0] -= this.userSpeed;
        this.drawUser();
        break;
      case 'ArrowRight':
        if (this.currentPosition[0] < this.boardWidth - this.blockWidth)
          this.currentPosition[0] += this.userSpeed;
        this.drawUser();
        break;
    }
  }

  moveBall() {
    this.ballCurrentPosition[0] += this.xDirection;
    this.ballCurrentPosition[1] += this.yDirection;
    this.drawBall();
    this.checkCollide();
  }

  startGame() {
    this.timerId = setInterval(this.moveBall.bind(this), this.ballSpeed);
    this.mkBlocks();
  }

  checkCollide() {
    // Check for block collisions
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (
        this.ballCurrentPosition[0] + this.ballDiameter > block.bottomLeft[0] &&
        this.ballCurrentPosition[0] < block.bottomRight[0] &&
        this.ballCurrentPosition[1] + this.ballDiameter > block.bottomLeft[1] &&
        this.ballCurrentPosition[1] < block.topLeft[1]
      ) {
        const allBlocks = Array.from(document.querySelectorAll('.block'));
        allBlocks[i].classList.remove('block');
        this.blocks.splice(i, 1);
        this.score++;
        this.scoreDisplay.innerHTML = this.score;

        const isBallAboveBlock =
          this.ballCurrentPosition[1] + this.ballDiameter - this.yDirection <
          block.bottomLeft[1];
        const isBallBelowBlock =
          this.ballCurrentPosition[1] - this.yDirection > block.topLeft[1];
        const isBallLeftOfBlock =
          this.ballCurrentPosition[0] + this.ballDiameter - this.xDirection <
          block.bottomLeft[0];
        const isBallRightOfBlock =
          this.ballCurrentPosition[0] - this.xDirection > block.bottomRight[0];

        if (isBallAboveBlock || isBallBelowBlock) {
          this.yDirection *= -1;
        }
        if (isBallLeftOfBlock || isBallRightOfBlock) {
          this.xDirection *= -1;
        }

        if (isBallAboveBlock) {
          this.ballCurrentPosition[1] = block.bottomLeft[1] - this.ballDiameter;
        } else if (isBallBelowBlock) {
          this.ballCurrentPosition[1] = block.topLeft[1];
        }
        if (isBallLeftOfBlock) {
          this.ballCurrentPosition[0] = block.bottomLeft[0] - this.ballDiameter;
        } else if (isBallRightOfBlock) {
          this.ballCurrentPosition[0] = block.bottomRight[0];
        }

        break;
      }
    }

    // Check for wall collisions
    if (
      this.ballCurrentPosition[0] >= this.boardWidth - this.ballDiameter ||
      this.ballCurrentPosition[0] <= 0
    ) {
      this.xDirection *= -1;
    }
    if (
      this.ballCurrentPosition[1] >= this.boardHeight - this.ballDiameter ||
      this.ballCurrentPosition[1] <= 0
    ) {
      this.yDirection *= -1;
    }

    // Check for user collisions
    if (
      this.ballCurrentPosition[0] + this.ballDiameter >
        this.currentPosition[0] &&
      this.ballCurrentPosition[0] < this.currentPosition[0] + this.blockWidth &&
      this.ballCurrentPosition[1] + this.ballDiameter >
        this.currentPosition[1] &&
      this.ballCurrentPosition[1] < this.currentPosition[1] + this.blockHeight
    ) {
      // Ball collision on dodgy corners
      const ballHitPosition =
        this.ballCurrentPosition[0] - this.currentPosition[0];
      // Ensure ball moves left
      if (ballHitPosition < this.blockWidth / 2) {
        this.xDirection = -Math.abs(this.xDirection);
        // Ensure ball moves right
      } else {
        this.xDirection = Math.abs(this.xDirection);
      }
      this.yDirection *= -1;

      // Stop ball getting stuck
      this.ballCurrentPosition[1] =
        this.currentPosition[1] + this.blockHeight + 1;
    }

    // Check for game over
    if (this.ballCurrentPosition[1] <= 0) {
      clearInterval(this.timerId);
      this.scoreDisplay.innerHTML = 'YOU LOSE';
      document.removeEventListener('keydown', this.moveUser.bind(this));
    }

    // Check for level completion
    if (this.blocks.length === 0) {
      this.levelUp();
    }
  }

  changeDirection() {
    this.xDirection *= -1;
    this.yDirection *= -1;
  }

  levelUp() {
    this.level++;
    this.levelDisplay.innerHTML = this.level;

    // Increase speed
    this.ballSpeed = Math.max(4, this.ballSpeed - 0.2);
    this.userSpeed = Math.min(50, this.userSpeed + 5);

    // Reset ball and user positions
    clearInterval(this.timerId);
    this.ballCurrentPosition = [...this.ballStart];
    this.currentPosition = [...this.userStart];
    this.drawBall();
    this.drawUser();

    // Create new blocks for the next level
    this.blocks = this.createBlocks();
    this.mkBlocks();

    // Restart ball movement with new speed
    this.timerId = setInterval(this.moveBall.bind(this), this.ballSpeed);
  }
}

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + 100, yAxis];
    this.topLeft = [xAxis, yAxis + 20];
    this.topRight = [xAxis + 100, yAxis + 20];
  }
}

// Initialize the game
const game = new BreakoutGame('.grid', '#score', '#level');
