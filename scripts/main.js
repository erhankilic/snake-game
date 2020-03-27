import { App } from './logic/App.js';
import { Ui } from './ui/Ui.js';

// setting a global var for the App
window.APP = null;

// initialising the App
function installApp () {
    return window.APP = App;
}

// the main function
function main () {
    let app = installApp();
    Ui.init(app);
}

// starting the main function
main();