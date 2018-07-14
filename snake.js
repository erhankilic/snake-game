'use strict';

let Snake = function () {
    let snake = this;
    
    snake.snake = [];
    snake.difficulty = 10;
    snake.gameArea = document.getElementsByClassName('game-area')[0];
    snake.startButton = document.getElementById('start-game');
    snake.stopButton = document.getElementById('stop-game');
    snake.scoreElement = document.getElementById('score');
    snake.rowLength = 64;
    snake.cellLength = 64;
    snake.direction = 'up';
    snake.directions = ['up', 'down', 'left', 'right'];
    snake.interval = null;
    snake.gameStarted = false;
    snake.score = 0;
    snake.bait = {
        x: null,
        y: null
    };

    if (!snake.gameArea || !snake.startButton || !snake.stopButton || !snake.scoreElement) {
        alert("#game-area, #start-game, #stop-game, #score id elements are required!");
        return;
    }

    snake.startButton.addEventListener('click', function () {
        snake.startGame();
    }, false);
    snake.stopButton.addEventListener('click', function () {
        snake.stopGame();
    }, false);

    document.onkeydown = function (event) {
        if (snake.gameStarted) {
            switch (event.key) {
                case "ArrowUp":
                    if (snake.direction !== 'down') {
                        snake.direction = 'up';
                    }
                    break;
                case "ArrowDown":
                    if (snake.direction !== 'up') {
                        snake.direction = 'down';
                    }
                    break;
                case "ArrowLeft":
                    if (snake.direction !== 'right') {
                        snake.direction = 'left';
                    }
                    break;
                case "ArrowRight":
                    if (snake.direction !== 'left') {
                        snake.direction = 'right';
                    }
                    break;
            }
        }
    };
};

/**
 * Creates new snake array
 */
Snake.prototype.newSnake = function () {
    let snake = this;
    snake.snake = [];

    for (let i = 0; i < 8; i++) {
        snake.snake.push({
            x: Math.ceil(snake.rowLength / 2) + i,
            y: Math.ceil(snake.cellLength / 2)
        })
    }

    snake.direction = "up";
    snake.score = 0;

    snake.renderGameArea();
};

/**
 * Creates game area and new snake
 * @param row
 * @param cell
 */
Snake.prototype.createGameArea = function (row, cell) {
    let snake = this;
    let rowElement, cellElement, rowi, celli;

    if (!snake.gameArea) {
        alert("#game-area id element is required!");
        return;
    }

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

/**
 * Renders game area.
 */
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

/**
 * Start the game
 */
Snake.prototype.startGame = function () {
    let snake = this;
    snake.gameStarted = true;
    snake.interval = setInterval(function () {
        snake.move();
    }, 400 / snake.difficulty);
    snake.startButton.style.display = 'none';
    snake.stopButton.style.display = 'block';
    snake.createBait();
};

/**
 * Stop the game
 */
Snake.prototype.stopGame = function () {
    let snake = this;
    snake.gameStarted = false;
    clearInterval(snake.interval);
    snake.startButton.style.display = 'block';
    snake.stopButton.style.display = 'none';
    snake.newSnake();
};

/**
 * Ends the game
 */
Snake.prototype.endGame = function () {
    alert('Game Over!! Yout score is ' + this.score);
    this.stopGame();
};

/**
 * Move the snake
 */
Snake.prototype.move = function () {
    let snake = this;
    let firstSnakeCell = snake.snake[0];
    let lastSnakeCell = snake.snake[snake.snake.length - 1];
    let cellCoordinates = "[data-x='" + lastSnakeCell.x + "'][data-y='" + lastSnakeCell.y + "']";
    let newSnakeCell = {};
    let x, y, snakeCellElement;

    switch (snake.direction) {
        case 'up':
            x = firstSnakeCell.x - 1;
            newSnakeCell.x = x < 1 ? snake.rowLength : x;
            newSnakeCell.y = firstSnakeCell.y;
            break;
        case 'down':
            x = firstSnakeCell.x + 1;
            newSnakeCell.x = x > snake.rowLength ? 1 : x;
            newSnakeCell.y = firstSnakeCell.y;
            break;
        case 'left':
            y = firstSnakeCell.y - 1;
            newSnakeCell.x = firstSnakeCell.x;
            newSnakeCell.y = y < 1 ? snake.cellLength : y;
            break;
        case 'right':
            y = firstSnakeCell.y + 1;
            newSnakeCell.x = firstSnakeCell.x;
            newSnakeCell.y = y > snake.cellLength ? 1 : y;
            break;
    }

    // Check if snake is crashed with itself
    for (let cell of snake.snake) {
        if (cell.x == newSnakeCell.x && cell.y == newSnakeCell.y) {
            snake.endGame();
            return;
        }
    }

    // If snake eats bait, create new bait, else continue the game
    if (newSnakeCell.x == snake.bait.x && newSnakeCell.y == snake.bait.y) {
        snake.createBait();
        snake.score += snake.difficulty * 10;
        snake.scoreElement.innerText = snake.score;
    } else {
        // Make last snake cell's element background color to white
        snakeCellElement = document.querySelector(cellCoordinates);
        snakeCellElement.setAttribute('class', 'cell');

        //Make first snake cell's elenment background color to black
        cellCoordinates = "[data-x='" + newSnakeCell.x + "'][data-y='" + newSnakeCell.y + "']";
        snakeCellElement = document.querySelector(cellCoordinates);
        snakeCellElement.setAttribute('class', 'cell black');

        // Remove last snake cell
        snake.snake.splice(snake.snake.length - 1, 1);
    }

    // Add new cell to head of the snake
    snake.snake.unshift(newSnakeCell);
};

/**
 * Create new bait
 */
Snake.prototype.createBait = function () {
    let snake = this;
    let bait = snake.createRandomInt();
    let baitCoordinates, baitCell;
    snake.bait.x = bait.x;
    snake.bait.y = bait.y;

    //Make first snake cell's elenment background color to black
    baitCoordinates = "[data-x='" + bait.x + "'][data-y='" + bait.y + "']";
    baitCell = document.querySelector(baitCoordinates);
    baitCell.setAttribute('class', 'cell black');
};

/**
 * Create random coordinates for bait
 * @returns {{x: number, y: number}}
 */
Snake.prototype.createRandomInt = function () {
    let snake = this;
    let isSame = false;
    let x = Math.floor(Math.random() * snake.rowLength) + 1;
    let y = Math.floor(Math.random() * snake.cellLength) + 1;

    for (let cell of snake.snake) {
        if (cell.x == x && cell.y == y) {
            isSame = true;
            break;
        }
    }

    return isSame ? snake.createRandomInt() : {x: x, y: y};
};

/**
 * Set game difficulty
 * @param value
 */
Snake.prototype.setDifficulty = function (value) {
    if (!this.gameStarted) {
        if (typeof value !== "number") {
            alert("Difficulty must be number!");
            return;
        }

        this.difficulty = value;
    }
};

/**
 * Set game area lengths
 * @param rowLength
 * @param cellLength
 */
Snake.prototype.setGameArea = function (rowLength, cellLength) {
    if (!this.gameStarted) {
        if (typeof rowLength !== "number" || typeof cellLength !== "number") {
            alert("Row length and cell length must be number!");
            return;
        }

        this.createGameArea(rowLength, cellLength);
    }
};