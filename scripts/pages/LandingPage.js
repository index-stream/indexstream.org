import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import PageController from '../controllers/PageController.js';

class LandingPage extends Page {
    constructor() {
        super(PAGES.LANDING);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Connect button click handlers (both primary and secondary)
        const connectBtn = document.getElementById('connect-btn');
        const connectBtnSecondary = document.getElementById('connect-btn-secondary');
        
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                this.handleConnect();
            });
        }
        
        if (connectBtnSecondary) {
            connectBtnSecondary.addEventListener('click', () => {
                this.handleConnect();
            });
        }
    }

    async onShow() {
        console.log('Landing page shown');
        // Any initialization logic for the landing page can go here
    }

    handleConnect() {
        console.log('Connect button clicked');
        // Navigate to the connect page
        PageController.showPage(PAGES.CONNECT);
    }
}

export default LandingPage;
