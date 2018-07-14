(function () {
    'use strict';

    let game = new Snake();
    let difficulty = document.getElementById("game-difficulty");
    let rowLength = document.getElementById("row-length");
    let cellLength = document.getElementById("cell-length");
    let setButton = document.getElementById("set-game-settings");

    setSettings();

    setButton.addEventListener("click", function () {
        setSettings();
    });

    function setSettings() {
        let row = parseInt(rowLength.value), cell = parseInt(cellLength.value);

        game.setDifficulty(parseInt(difficulty.value));
        game.setGameArea(row > 15 ? row : 16, cell > 15 ? cell : 16);
    }
})();