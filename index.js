'use strict';

const grid = document.querySelector('.grid');
const blockWidth = 100;
const blockHeight = 20;

const userStart = [230, 10];
let currentPosition = userStart;

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
user.style.left = currentPosition[0] + 'px';
user.style.bottom = currentPosition[1] + 'px';
grid.appendChild(user);

// Moving user
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      currentPosition[0] -= 10;
      user.style.left = currentPosition[0] + 'px';
  }
}
