import PageController from './controllers/PageController.js';
import { PAGES } from './constants/constants.js';
import InitialPage from './pages/InitialPage.js';
import ConnectPage from './pages/ConnectPage.js';
import ProfilesPage from './pages/ProfilesPage.js';

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
        PageController.register(new ConnectPage(), PAGES.CONNECT);
        PageController.register(new ProfilesPage(), PAGES.PROFILES);
    }
}

let main = new Main();
export default main;
