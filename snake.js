'use strict';

let Snake = function () {
    let snake = this;
    
    snake.snake = [];
    snake.difficulty = 1;
    snake.gameArea = document.getElementsByClassName('game-area')[0];
    snake.startButton = document.getElementById('start-game');
    snake.stopButton = document.getElementById('stop-game');
    snake.rowLength = 64;
    snake.cellLength = 64;
    snake.direction = 'up';
    snake.directions = ['up', 'down', 'left', 'right'];
    snake.interval = null;

    snake.startButton.addEventListener('click', function () {
        snake.startGame();
    }, false);
    snake.stopButton.addEventListener('click', function () {
        snake.stopGame();
    }, false);
};

Snake.prototype.createGameArea = function (row = 64, cell = 64) {
    let rowElement, cellElement, rowi, celli;

    this.rowLength = row;
    this.cellLength = cell;
    this.gameArea.innerHTML = '';

    for (rowi = 1; rowi <= row; rowi++) {
        rowElement = document.createElement('div');
        rowElement.setAttribute('class', 'row');

        for (celli = 1; celli <= cell; celli++) {
            cellElement = document.createElement('div');
            cellElement.setAttribute('class', 'cell');
            cellElement.setAttribute('data-x', rowi);
            cellElement.setAttribute('data-y', celli);
            rowElement.append(cellElement);
        }

        this.gameArea.append(rowElement);
    }

    this.newSnake();
};

Snake.prototype.newSnake = function () {
    this.snake = [];

    for (let i = 0; i < 8; i++) {
        this.snake.push({
            x: Math.ceil(this.rowLength / 2) + i,
            y: Math.ceil(this.cellLength / 2)
        })
    }

    this.renderGameArea();
};

Snake.prototype.renderGameArea = function () {
    let cell, cellIndex, cellX, cellY;
    let snakeCell, snakeIndex;
    let cells = document.getElementsByClassName('cell');

    for (cellIndex in cells) {
        cell = cells[cellIndex];

        if (typeof cell === "object") {
            let isSnakeCell = false;

            cellX = cell.getAttribute('data-x');
            cellY = cell.getAttribute('data-y');

            for (snakeIndex in this.snake) {
                snakeCell = this.snake[snakeIndex];

                if (snakeCell.x == cellX && snakeCell.y == cellY) {
                    isSnakeCell = true;
                }
            }

            if (isSnakeCell) {
                cell.setAttribute('class', 'cell black');
            } else {
                cell.setAttribute('class', 'cell');
            }
        }
    }
};

Snake.prototype.startGame = function () {
    this.interval = setInterval(function () {
        console.log(true);
    }, 500 / this.difficulty);
    this.startButton.style.display = 'none';
    this.stopButton.style.display = 'block';
};

Snake.prototype.stopGame = function () {
    clearInterval(this.interval);
    this.startButton.style.display = 'block';
    this.stopButton.style.display = 'none';
};