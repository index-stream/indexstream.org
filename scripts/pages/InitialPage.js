import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import PageController from '../controllers/PageController.js';
import Server from '../clients/Server.js';

class InitialPage extends Page {
    constructor() {
        super(PAGES.INITIAL);
    }

    async onShow() {
        console.log('Initial page shown');

        const isAlreadySetup = await this.checkIfConnected();
        if(isAlreadySetup) {
            PageController.showPage(PAGES.PROFILES);
        } else {
            PageController.showPage(PAGES.CONNECT);
        }
    }

    async checkIfConnected() {
        const serverId = Server.getServerId();
        const serverUrl = Server.getServerUrl();
        const token = (serverId) ? localStorage.getItem(serverId) : null;
        if(serverId && serverUrl && token) {
            const loadingElement = document.getElementById('initial-page-loading');
            if(loadingElement) loadingElement.classList.remove('hidden');
            try {
                const response = await Server.checkToken(token);
                Server.setServerName(response.serverName);
                Server.setProfiles(response.profiles);
                return true;
            } catch (error) {
                if(loadingElement) loadingElement.classList.add('hidden');
            }
        }
        return false;
    }
}

export default InitialPage;
