'use strict';

let Snake = function () {
    this.snake = [];
    this.difficulty = 1;
    this.gameArea = document.getElementsByClassName('game-area')[0];
    this.rowLength = 64;
    this.cellLength = 64;
    this.direction = 'up';
    this.directions = ['up', 'down', 'left', 'right'];
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
            cellX = cell.getAttribute('data-x');
            cellY = cell.getAttribute('data-y');

            for (snakeIndex in this.snake) {
                snakeCell = this.snake[snakeIndex];

                if (snakeCell.x == cellX && snakeCell.y == cellY) {
                    cell.setAttribute('class', cell.getAttribute('class') + ' black');
                }
            }
        }
    }
};