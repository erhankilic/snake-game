const Ui = {};

Ui.HTMLElemtents = {
    document: document,
    gameArea: document.getElementById('game-area'),
    startButton: document.getElementById('start-game'),
    stopButton: document.getElementById('stop-game'),
    title: document.head.getElementsByTagName('title')[0],
    score: document.getElementById('score'),
    difficulty: document.getElementById('game-difficulty'),
    difficultyLabel: document.getElementById('game-difficulty-label'),
    settingsButton: document.getElementById('set-game-settings'),
    rowLength: document.getElementById('row-length'),
    cellLength: document.getElementById('cell-length')
};

/**
 * Creates a new HTMLElement
 * @param {string} type - The type of the specialized HTMLElement. E.g. "div" creates a HTMLDivElement
 * @param {object<string><*>} [attributes={}] - A name: value object, representing additional attributes.
 * @param {string[]|string} [cssClasses=[]] - An array of cssClass names.
 * @param {Node} [appendTo=null] - A node to insert the returned
 * @return {HTMLElement}
 */
Ui.HTMLElemtents.create = (type, attributes = {}, cssClasses = [], appendTo = null) => {
    // creating the new HTMLElement
    let output = document.createElement(type);

    // adding all given attributes
    for (let [attributeName, value] of Object.entries(attributes))
        output.setAttribute(attributeName, value);

    // adding the css classes
    if (typeof cssClasses === 'string')
        output.classList.add(cssClasses);
    else
        cssClasses.forEach((cls) => output.classList.add(cls));

    if (appendTo)
        appendTo.appendChild(output);

    return output;
};

Ui.settings = {};
Ui.settings.onDifficultyChange = (value) => {
    Ui.HTMLElemtents.difficultyLabel.value = value;
};
/**
 * Toggles the visibility of an HTMLElement. Good for reducing reflow.
 * @param {HTMLElement} htmlElement - The element to be toggled
 * @return {boolean} - Returns if the HTMLObject ist visible now
 */
Ui.HTMLElemtents.toggle = (htmlElement) => {
    let isVisible = true;
    let dataName = '_initialDisplayValue';

    // check if a custom value for the initial display style is present
    let initialValue = htmlElement.dataset[dataName];

    if (typeof initialValue !== 'undefined') {
        // set the style.display to the initial value
        htmlElement.style.display = initialValue;
        // remove the custom data- entry
        delete htmlElement.dataset[dataName];
    } else {
        htmlElement.dataset[dataName] = htmlElement.style.display || '';
        htmlElement.style.display = 'none';
        isVisible = false;
    }
    return isVisible;
};
/**
 * Initializes the whole user interface
 * @param app
 */
Ui.init = function (app = window.APP) {
    try {
        console.log('HTMLElements correct loaded:', Ui.init.checkHTMLElements(app));
        Ui.HTMLElemtents.toggle(Ui.HTMLElemtents.stopButton);
        console.log('App correct initialised:', Ui.init.app(app));
        console.log('GameArea correct initialised:', Ui.init.gameArea(app));
        console.log('Listener installed:', Ui.init.listeners(app));
        console.log('rendered settings correct:', Ui.render.settings(app));
    } catch (e) {
        console.error(e);
        alert('A critical error occurred: ' + e.message);
    }
};
Ui.init.checkHTMLElements = () => {
    // if any document.findElementById failed it will throw an error
    if (Object.values(Ui.HTMLElemtents).includes(null))
        throw Error('Not all UI elements are in the HTML file');
    return true;
};
Ui.init.app = (app = window.APP) => {
    Ui.HTMLElemtents.title.textContent = app.name + ' (V' + app.version + ')';
    return true;
};
Ui.init.listeners = (app = window.APP) => {
    let htmlElements = Ui.HTMLElemtents;
    htmlElements.document.addEventListener('keydown', (event) => {
            if (app.gameStarted) {
                switch (event.key) {
                    case 'ArrowUp':
                        if (app.direction !== 'down') {
                            app.direction = 'up';
                        }
                        break;
                    case 'ArrowDown':
                        if (app.direction !== 'up') {
                            app.direction = 'down';
                        }
                        break;
                    case 'ArrowLeft':
                        if (app.direction !== 'right') {
                            app.direction = 'left';
                        }
                        break;
                    case 'ArrowRight':
                        if (app.direction !== 'left') {
                            app.direction = 'right';
                        }
                        break;
                }
            }
        }
    );
    htmlElements.startButton.addEventListener('click', function () {
        Ui.HTMLElemtents.toggle(Ui.HTMLElemtents.startButton);
        Ui.HTMLElemtents.toggle(Ui.HTMLElemtents.stopButton);
        app.startGame();
    }, false);
    htmlElements.stopButton.addEventListener('click', function () {
        Ui.HTMLElemtents.toggle(Ui.HTMLElemtents.startButton);
        Ui.HTMLElemtents.toggle(Ui.HTMLElemtents.stopButton);
        app.stopGame();
        Ui.render.gameArea(app);
    }, false);
    htmlElements.difficulty.addEventListener('change', Ui.render.difficulty);
    htmlElements.settingsButton.addEventListener('click', () => {
        let difficulty = Math.min(10, Math.max(parseInt(Ui.HTMLElemtents.difficulty.value), 1));
        let rowLength = parseInt(Ui.HTMLElemtents.rowLength.value);
        let cellLength = parseInt(Ui.HTMLElemtents.cellLength.value);
        app.preferences.difficulty = difficulty;
        app.preferences.rowLength = rowLength;
        app.preferences.cellLength = cellLength;
        Ui.init.gameArea(app, rowLength, cellLength);
        Ui.render.gameArea();
        console.log('settings are set to:', { difficulty: difficulty, rowLength: rowLength, cellLength: cellLength });
    });

    return true;
};
Ui.init.gameArea = (app = window.APP, rows = 0, columns = 0) => {
    if (rows)
        app.preferences.rowLength = rows;
    else
        rows = app.preferences.rowLength;
    if (columns)
        app.preferences.cellLength = columns;
    else
        columns = app.preferences.cellLength;

    let gameArea = Ui.HTMLElemtents.gameArea;

    // reduces reflow by hiding first
    Ui.HTMLElemtents.toggle(gameArea);

    // clearing the gameArea
    gameArea.innerHTML = '';

    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {

        // create the row and attach it to the gameArea
        let rowElement = Ui.HTMLElemtents.create('div', {}, 'row', gameArea);

        for (let cellIndex = 1; cellIndex <= columns; cellIndex++) {

            // creating the cell and attach it to the rowElement
            Ui.HTMLElemtents.create('div', { 'data-x': rowIndex, 'data-y': cellIndex }, 'cell', rowElement);
        }
    }
    // make it visible again
    Ui.HTMLElemtents.toggle(gameArea);

    app.resetSnake();
    return true;
};
Ui.render = {};
Ui.render.gameArea = (app = window.APP) => {
    for (let cell of document.getElementsByClassName('cell'))
        if (typeof cell === 'object') {

            let cellX = parseInt(cell.getAttribute('data-x'));
            let cellY = parseInt(cell.getAttribute('data-y'));

            let isSnakeCell = Boolean(app.snake.find(obj => obj.x === cellX && obj.y === cellY));

            if (isSnakeCell) {
                cell.setAttribute('class', 'cell black');
            } else {
                cell.setAttribute('class', 'cell');
            }
        }
    return true;
};
Ui.render.score = (app = window.APP) => {
    Ui.HTMLElemtents.score.textContent = app.score;
    return true;
};
Ui.render.difficulty = () => {
    Ui.HTMLElemtents.difficultyLabel.textContent = Ui.HTMLElemtents.difficulty.value;
    return true;
};
Ui.render.settings = (app = window.APP) => {
    return !([
        Ui.render.score(app),
        Ui.render.difficulty()
    ].includes(false));
};

export { Ui };