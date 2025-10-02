import { PAGES } from '../constants/constants.js';

class PageController {
    constructor() {
        this.pages = new Map();
        this.currentPage = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for navigation events from pages
        document.addEventListener('navigate', (e) => {
            this.showPage(e.detail.page);
        });
    }

    register(pageInstance, pageName) {
        if (!Object.values(PAGES).includes(pageName)) {
            throw new Error(`Invalid page name: ${pageName}. Must be one of: ${Object.values(PAGES).join(', ')}`);
        }

        this.pages.set(pageName, pageInstance);
        console.log(`Page registered: ${pageName}`);
    }

    showPage(pageName) {
        if (!this.pages.has(pageName)) {
            throw new Error(`Page not registered: ${pageName}`);
        }

        // Hide current page if there is one
        if (this.currentPage) {
            this.currentPage.hide();
        }

        // Show the requested page
        const pageInstance = this.pages.get(pageName);
        this.currentPage = pageInstance;
        pageInstance.show();
    }

    hideAllPages() {
        Object.values(PAGES).forEach(pageName => {
            const pageInstance = this.pages.get(pageName);
            if (pageInstance) {
                pageInstance.hide();
            }
        });
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getPage(pageName) {
        return this.pages.get(pageName);
    }
}

let pageController = new PageController();
export default pageController;
