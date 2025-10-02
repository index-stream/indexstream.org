import Page from './Page.js';
import { PAGES } from '../constants/constants.js';

class ProfilesPage extends Page {
    constructor() {
        super(PAGES.PROFILES);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners will be added here when needed
    }

    async onShow() {
        console.log('Profiles page shown');
        console.log('TODO: Fetch profiles from server');
        
        // Show loading state
        this.showLoadingState();
    }

    showLoadingState() {
        const loadingElement = document.getElementById('profiles-loading');
        const contentElement = document.getElementById('profiles-content');
        
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
        if (contentElement) {
            contentElement.classList.add('hidden');
        }
    }

    hideLoadingState() {
        const loadingElement = document.getElementById('profiles-loading');
        const contentElement = document.getElementById('profiles-content');
        
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        if (contentElement) {
            contentElement.classList.remove('hidden');
        }
    }
}

export default ProfilesPage;
