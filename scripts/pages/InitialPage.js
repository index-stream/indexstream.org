import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import PageController from '../controllers/PageController.js';

class InitialPage extends Page {
    constructor() {
        super(PAGES.INITIAL);
    }

    async onShow() {
        console.log('Initial page shown');

        const isAlreadySetup = await this.checkIfConnected();
        if(isAlreadySetup) {
            //TODO: create HOME page
            PageController.showPage(PAGES.HOME);
        } else {
            PageController.showPage(PAGES.LANDING);
        }
    }

    async checkIfConnected() {
        return false;
        //try {
        //    const response = await Backend.getConfiguration();
        //    console.log('Configuration:', response.config);
        //    return !!response.config;
        //} catch (error) {
        //    return false;
        //}
    }
}

export default InitialPage;
