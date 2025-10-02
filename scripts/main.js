import PageController from './controllers/PageController.js';
import { PAGES } from './constants/constants.js';
import InitialPage from './pages/InitialPage.js';
import LandingPage from './pages/LandingPage.js';
import ConnectPage from './pages/ConnectPage.js';

class Main {
    constructor() {
        this.init();
    }

    init() {
        console.log('App initialized');
        this.registerPages();
        PageController.showPage(PAGES.INITIAL);
    }

    registerPages() {
        // Register all pages with the PageController
        PageController.register(new InitialPage(), PAGES.INITIAL);
        PageController.register(new LandingPage(), PAGES.LANDING);
        PageController.register(new ConnectPage(), PAGES.CONNECT);
    }
}

let main = new Main();
export default main;
