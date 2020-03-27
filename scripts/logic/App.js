import { Ui } from '../ui/Ui.js';

const App = {
    // meta data
    name: 'Snake Game!',
    version: '1.01',

    // internal stuff
    snake: [],
    direction: 'up',
    directions: ['up', 'down', 'left', 'right'],
    interval: null,

    // states
    gameStarted: false,
    score: 0,
    bait: {
        x: null,
        y: null
    },

    // preferences
    preferences: {
        difficulty: 10,
        rowLength: 64,
        cellLength: 64
    },

    // functions
    startGame () {
        let self = this;
        this.gameStarted = true;
        this.interval = setInterval(function () {
            self.moveSnake();
            Ui.render.score(self);
        }, 400 / self.preferences.difficulty);
        this.createBait();
    },
    createBait () {
        let bait = this._getRandomInt();
        this.bait.x = bait.x;
        this.bait.y = bait.y;

        //Make first snake cell's element background color to black
        let baitCoordinates = '[data-x=\'' + bait.x + '\'][data-y=\'' + bait.y + '\']';
        let baitCell = document.querySelector(baitCoordinates);
        baitCell.setAttribute('class', 'cell black');
        return true;
    },
    stopGame () {
        this.gameStarted = false;
        clearInterval(this.interval);
        this.resetSnake();
        return true;
    },
    endGame () {
        let score = this.score + 0;
        this.stopGame();
        alert('Game over! Your score is ' + score);
    },
    resetSnake () {
        let snake = this.snake;
        // clear the existing array
        snake.length = 0;

        for (let i = 0; i < 8; i++)
            snake.push({
                x: Math.ceil(this.preferences.rowLength / 2) + i,
                y: Math.ceil(this.preferences.cellLength / 2)
            });
        this.direction = 'up';
        this.score = 0;
        return true;
    },
    _getRandomInt () {
        let x = Math.floor(Math.random() * this.preferences.rowLength) + 1;
        let y = Math.floor(Math.random() * this.preferences.cellLength) + 1;

        return (this.snake.find(cell => cell.x === x && cell.y === y)) ? this._getRandomInt() : { x: x, y: y };
    },
    moveSnake () {
        let firstSnakeCell = this.snake[0];
        let lastSnakeCell = this.snake[this.snake.length - 1];
        let cellCoordinates = '[data-x=\'' + lastSnakeCell.x + '\'][data-y=\'' + lastSnakeCell.y + '\']';
        let newSnakeCell = {};
        let x, y, snakeCellElement;

        switch (this.direction) {
            case 'up':
                x = firstSnakeCell.x - 1;
                newSnakeCell.x = x < 1 ? this.preferences.rowLength : x;
                newSnakeCell.y = firstSnakeCell.y;
                break;
            case 'down':
                x = firstSnakeCell.x + 1;
                newSnakeCell.x = x > this.preferences.rowLength ? 1 : x;
                newSnakeCell.y = firstSnakeCell.y;
                break;
            case 'left':
                y = firstSnakeCell.y - 1;
                newSnakeCell.x = firstSnakeCell.x;
                newSnakeCell.y = y < 1 ? this.preferences.cellLength : y;
                break;
            case 'right':
                y = firstSnakeCell.y + 1;
                newSnakeCell.x = firstSnakeCell.x;
                newSnakeCell.y = y > this.preferences.cellLength ? 1 : y;
                break;
        }

        // Check if snake is crashed with itself
        if (this.snake.find(cell => cell.y === newSnakeCell.y && cell.x === newSnakeCell.x)) {
            this.endGame();
            return false;
        }

        // If snake eats bait, create new bait, else continue the game
        if (newSnakeCell.x === this.bait.x && newSnakeCell.y === this.bait.y) {
            this.createBait();
            this.score += this.preferences.difficulty * 10;
        } else {
            // Make last snake cell's element background color to white
            snakeCellElement = document.querySelector(cellCoordinates);
            snakeCellElement.setAttribute('class', 'cell');

            //Make first snake cell's element background color to black
            cellCoordinates = '[data-x=\'' + newSnakeCell.x + '\'][data-y=\'' + newSnakeCell.y + '\']';
            snakeCellElement = document.querySelector(cellCoordinates);
            snakeCellElement.setAttribute('class', 'cell black');

            // Remove last snake cell
            this.snake.splice(this.snake.length - 1, 1);
        }

        // Add new cell to head of the snake
        this.snake.unshift(newSnakeCell);
        return true;
    }
};
export { App };

