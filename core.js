(function () {
    'use strict';
    createGameArea();

    function createGameArea(row = 64, cell = 64) {
        let gameArea = document.getElementsByClassName('game-area');
        let rowElement, cellElement, rowi, celli;

        for (rowi = 0; rowi < row; rowi++) {
            rowElement = document.createElement('div');
            rowElement.setAttribute('class', 'row');

            for (celli = 0; celli < cell; celli++) {
                cellElement = document.createElement('div');
                cellElement.setAttribute('class', 'cell');
                rowElement.append(cellElement);
            }

            gameArea[0].append(rowElement);
        }
    }
})();