'use strict';

let Snake = function () {
    let snake = this;
    
    snake.snake = [];
    snake.difficulty = 10;
    snake.gameArea = document.getElementsByClassName('game-area')[0];
    snake.startButton = document.getElementById('start-game');
    snake.stopButton = document.getElementById('stop-game');
    snake.rowLength = 64;
    snake.cellLength = 64;
    snake.direction = 'up';
    snake.directions = ['up', 'down', 'left', 'right'];
    snake.interval = null;
    snake.gameStarted = false;

    snake.startButton.addEventListener('click', function () {
        snake.startGame();
    }, false);
    snake.stopButton.addEventListener('click', function () {
        snake.stopGame();
    }, false);

    document.onkeydown = function (event) {
        if (snake.gameStarted) {
            switch (event.keyCode) {
                case 38:
                    snake.direction = 'up';
                    break;
                case 40:
                    snake.direction = 'down';
                    break;
                case 37:
                    snake.direction = 'left';
                    break;
                case 39:
                    snake.direction = 'right';
                    break;
            }
        }
    };
};

Snake.prototype.createGameArea = function (row = 64, cell = 64) {
    let snake = this;
    let rowElement, cellElement, rowi, celli;

    snake.rowLength = row;
    snake.cellLength = cell;
    snake.gameArea.innerHTML = '';

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

        snake.gameArea.append(rowElement);
    }

    snake.newSnake();
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
    let snake = this;
    let cell, cellIndex, cellX, cellY;
    let snakeCell, snakeIndex;
    let cells = document.getElementsByClassName('cell');

    for (cellIndex in cells) {
        cell = cells[cellIndex];

        if (typeof cell === "object") {
            let isSnakeCell = false;

            cellX = cell.getAttribute('data-x');
            cellY = cell.getAttribute('data-y');

            for (snakeIndex in snake.snake) {
                snakeCell = snake.snake[snakeIndex];

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
    let snake = this;
    snake.gameStarted = true;
    snake.interval = setInterval(function () {
        snake.move();
    }, 400 / snake.difficulty);
    snake.startButton.style.display = 'none';
    snake.stopButton.style.display = 'block';
};

Snake.prototype.stopGame = function () {
    let snake = this;
    snake.gameStarted = false;
    clearInterval(snake.interval);
    snake.startButton.style.display = 'block';
    snake.stopButton.style.display = 'none';
};

Snake.prototype.move = function () {
    let snake = this;
    let firstSnakeCell = snake.snake[0];
    let newSnakeCell = {};

    switch (snake.direction) {
        case 'up':
            newSnakeCell.x = firstSnakeCell.x - 1;
            newSnakeCell.y = firstSnakeCell.y;
            break;
        case 'down':
            newSnakeCell.x = firstSnakeCell.x + 1;
            newSnakeCell.y = firstSnakeCell.y;
            break;
        case 'left':
            newSnakeCell.x = firstSnakeCell.x;
            newSnakeCell.y = firstSnakeCell.y - 1;
            break;
        case 'right':
            newSnakeCell.x = firstSnakeCell.x;
            newSnakeCell.y = firstSnakeCell.y + 1;
            break;
    }

    snake.snake.unshift(newSnakeCell);
    snake.snake.splice(snake.snake.length - 1, 1);
    snake.renderGameArea();
};