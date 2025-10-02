import { PAGES } from '../constants/constants.js';

export default class Page {
    constructor(pageName) {
        this.pageName = pageName;
        this.pageElement = document.getElementById(`${pageName}-page`);
        
        if (!this.pageElement) {
            throw new Error(`Page element not found: ${pageName}-page`);
        }
    }

    show() {
        if (this.pageElement) {
            this.pageElement.classList.remove('hidden');
            this.onShow();
        }
    }

    hide() {
        if (this.pageElement) {
            this.pageElement.classList.add('hidden');
        }
    }

    getPageName() {
        return this.pageName;
    }

    // Method that child classes should override
    onShow() {
        // Default implementation - can be overridden
    }
}
