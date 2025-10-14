import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import PageController from '../controllers/PageController.js';
import Server from '../clients/Server.js';

class InitialPage extends Page {
    constructor() {
        super(PAGES.INITIAL);
    }

    async onShow() {
        const hasUrlConnectCode = this.checkUrlConnectCode();
        if(hasUrlConnectCode) {
            PageController.showPage(PAGES.CONNECT);
            return;
        }

        const isAlreadySetup = await this.checkIfConnected();
        if(isAlreadySetup) {
            PageController.showPage(PAGES.PROFILES);
        } else {
            PageController.showPage(PAGES.CONNECT);
        }
    }

    checkUrlConnectCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const connectCode = urlParams.get('connectCode');
        if(!connectCode) return false;
        const connectCodeInput = document.getElementById('connect-code');
        if (connectCodeInput) connectCodeInput.value = connectCode;
        try {
            const connectSubmitBtn = document.getElementById('connect-submit-btn');
            if(connectSubmitBtn) {
                connectSubmitBtn.disabled = false;
                connectSubmitBtn.click();
                return true;
            }
        } catch (error) {
            console.error('Error checking URL connect code:', error);
            Server.setServerId(null);
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
                Server.setIndexes(response.indexes);
                return true;
            } catch (error) {
                Server.setServerId(''); //To prevent trying to connect again on page refresh
                if(loadingElement) loadingElement.classList.add('hidden');
            }
        }
        return false;
    }
}

export default InitialPage;
