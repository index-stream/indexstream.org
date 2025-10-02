import Page from './Page.js';
import { PAGES, IS_DEV, IS_LOCAL } from '../constants/constants.js';
import PageController from '../controllers/PageController.js';
import Server from '../clients/Server.js';
import { decompressConnectCode } from '../utils/connect-code.js';

class ConnectPage extends Page {
    constructor() {
        super(PAGES.CONNECT);
        this.authWindow = null;
        this.setupEventListeners();
        this.setupAuthMessageListener();
    }

    setupEventListeners() {
        // Connect form submission
        const connectForm = document.getElementById('connect-form');
        if (connectForm) {
            connectForm.addEventListener('submit', (e) => {
                this.handleConnect(e);
            });
        }

        // Connect code input validation and formatting
        const connectCodeInput = document.getElementById('connect-code');
        if (connectCodeInput) {
            connectCodeInput.addEventListener('input', (e) => {
                this.formatConnectCode(e);
            });
            
            connectCodeInput.addEventListener('paste', (e) => {
                // Allow paste, then format the pasted content
                setTimeout(() => {
                    this.formatConnectCode(e);
                }, 0);
            });
        }

        // Back button
        const backBtn = document.getElementById('back-to-landing-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.handleBack();
            });
        }

        // Certificate step buttons
        const visitServerCertBtn = document.getElementById('visit-server-cert-btn');
        const tryAgainCertBtn = document.getElementById('try-again-cert-btn');
        
        if (visitServerCertBtn) {
            visitServerCertBtn.addEventListener('click', () => {
                this.handleVisitServer(true);
            });
        }
        
        if (tryAgainCertBtn) {
            tryAgainCertBtn.addEventListener('click', () => {
                this.resetToForm();
            });
        }

        // Authentication step buttons
        const visitServerAuthBtn = document.getElementById('visit-server-auth-btn');
        const tryAgainAuthBtn = document.getElementById('try-again-auth-btn');
        
        if (visitServerAuthBtn) {
            visitServerAuthBtn.addEventListener('click', () => {
                this.handleVisitServer();
            });
        }
        
        if (tryAgainAuthBtn) {
            tryAgainAuthBtn.addEventListener('click', () => {
                this.resetToForm();
            });
        }

        // Help section toggle
        const helpToggle = document.getElementById('help-toggle');
        if (helpToggle) {
            helpToggle.addEventListener('click', () => {
                this.toggleHelp();
            });
        }
    }

    async onShow() {
        console.log('TODO: Check cache for token');
        // Focus on the connect code input
        const connectCodeInput = document.getElementById('connect-code');
        if (connectCodeInput) {
            connectCodeInput.focus();
        }
    }

    formatConnectCode(e) {
        const input = e.target;
        let value = input.value.toUpperCase();
        
        // Remove I and O characters (ambiguous with 1 and 0)
        value = value.replace(/[IO]/g, '');
        
        // Only keep allowed characters (A-H, J-N, P-Z)
        value = value.replace(/[^A-HJ-NP-Z]/g, '');
        
        input.value = value;
        
        // Enable/disable connect button based on input length
        const connectBtn = document.getElementById('connect-submit-btn');
        if (connectBtn) {
            connectBtn.disabled = value.length < 1; // Minimum 1 character
        }
        
        // Clear any error message when user starts typing
        this.clearError();
    }

    async handleConnect(e) {
        e.preventDefault();
        
        const connectCodeInput = document.getElementById('connect-code');
        const connectCode = connectCodeInput.value.trim();
        let ip, port;
        try {
            ({ ip, port } = decompressConnectCode(connectCode));
        } catch (error) {
            this.showError('Invalid connect code');
            return;
        }
        console.log("IP: ", ip);
        console.log("Port: ", port);

        // Show loading state
        this.setLoadingState(true);
        
        try {
            console.log('Attempting to connect with code:', connectCode);
            
            Server.setServer(ip, port);
            let response = await Server.ping();
            if(!response.message.includes('Index Media Server')) throw new Error('Invalid connect code');

            try {
                response = await Server.login();
                Server.setToken(response.token);
                PageController.showPage(PAGES.PROFILES);
            } catch (error) {
                this.showAuthenticationError();
            }
            
        } catch (error) {
            if (error.name == 'TypeError') {
                this.showCertificateError();
            } else {
                console.error('Connection failed:', error);
                this.showError('Failed to connect to server. Please check your connect code and try again.');
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        const connectBtn = document.getElementById('connect-submit-btn');
        const connectCodeInput = document.getElementById('connect-code');
        
        if (connectBtn) {
            connectBtn.disabled = isLoading;
            connectBtn.innerHTML = isLoading 
                ? '<svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Connecting...'
                : '<svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>Connect';
        }
        
        if (connectCodeInput) {
            connectCodeInput.disabled = isLoading;
        }
        
        // Only hide error message when starting to load, not when finishing
        if (isLoading) {
            const errorMessage = document.getElementById('connect-error');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }
    }

    showError(message) {
        const errorElement = document.getElementById('connect-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    clearError() {
        const errorElement = document.getElementById('connect-error');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    showCertificateError() {
        this.hideForm();
        this.showCertificateStep();
    }

    showNetworkError() {
        this.hideForm();
        this.showCertificateStep();
        this.showNetworkErrorMessage();
    }

    showNetworkErrorMessage() {
        const networkError = document.getElementById('network-error');
        if (networkError) {
            networkError.classList.remove('hidden');
        }
    }

    hideNetworkErrorMessage() {
        const networkError = document.getElementById('network-error');
        if (networkError) {
            networkError.classList.add('hidden');
        }
    }

    showAuthenticationError() {
        this.hideForm();
        this.showAuthenticationStep();
    }

    showCertificateStep() {
        const certificateStep = document.getElementById('certificate-step');
        if (certificateStep) {
            certificateStep.classList.remove('hidden');
        }
    }

    showAuthenticationStep() {
        const authenticationStep = document.getElementById('authentication-step');
        if (authenticationStep) {
            authenticationStep.classList.remove('hidden');
        }
    }

    hideForm() {
        const headerDescription = document.querySelector('#connect-page .text-center.mb-8 p');
        const connectForm = document.getElementById('connect-form');
        const backBtn = document.getElementById('back-to-landing-btn');
        const helpSection = document.getElementById('help-section');
        const certificateStep = document.getElementById('certificate-step');
        const authenticationStep = document.getElementById('authentication-step');
        
        if (headerDescription) {
            headerDescription.classList.add('hidden');
        }
        if (connectForm) {
            connectForm.classList.add('hidden');
        }
        if (backBtn) {
            backBtn.classList.add('hidden');
        }
        if (helpSection) {
            helpSection.classList.add('hidden');
        }
        if (certificateStep) {
            certificateStep.classList.add('hidden');
        }
        if (authenticationStep) {
            authenticationStep.classList.add('hidden');
        }
        
        // Hide network error message when hiding form
        this.hideNetworkErrorMessage();
    }

    showForm() {
        const headerDescription = document.querySelector('#connect-page .text-center.mb-8 p');
        const connectForm = document.getElementById('connect-form');
        const backBtn = document.getElementById('back-to-landing-btn');
        const helpSection = document.getElementById('help-section');
        const certificateStep = document.getElementById('certificate-step');
        const authenticationStep = document.getElementById('authentication-step');
        
        if (headerDescription) {
            headerDescription.classList.remove('hidden');
        }
        if (connectForm) {
            connectForm.classList.remove('hidden');
        }
        if (backBtn) {
            backBtn.classList.remove('hidden');
        }
        if (helpSection) {
            helpSection.classList.remove('hidden');
        }
        if (certificateStep) {
            certificateStep.classList.add('hidden');
        }
        if (authenticationStep) {
            authenticationStep.classList.add('hidden');
        }
    }

    resetToForm() {
        this.showForm();
        // Clear the connect code input
        const connectCodeInput = document.getElementById('connect-code');
        if (connectCodeInput) {
            connectCodeInput.value = '';
            connectCodeInput.focus();
        }
        // Clear any error messages
        this.clearError();
        this.hideNetworkErrorMessage();
    }

    setupAuthMessageListener() {
        window.addEventListener('message', (event) => {
            // Verify the message came from our authentication window
            if (this.authWindow && 
                event.source === this.authWindow && 
                event.data && 
                event.data.type === 'AUTH_SUCCESS') {
                
                console.log('Authentication successful! Token received:', event.data.token);
                
                // Store the token
                Server.setToken(event.data.token);
                
                if(this._backupListenerForLostOpener) {
                    window.removeEventListener('focus', this._backupListenerForLostOpener);
                }

                // Close the authentication window
                if (!this.authWindow.closed) {
                    this.authWindow.close();
                    this.authWindow = null;
                }
                
                PageController.showPage(PAGES.PROFILES);
            }
        });
    }

    handleVisitServer(backupListenerForLostOpener) {
        let serverUrl = Server.getServerUrl() + '?hasOpener=true';
        if(IS_DEV) serverUrl += '&dev=' + ((IS_LOCAL) ? "local" : true);
        if (serverUrl) {
            console.log("Opening server URL: ", serverUrl);
            this.authWindow = window.open(serverUrl, '_blank');
            //Add listener to when this tab is focused again
            if(backupListenerForLostOpener) {
                if(!this._backupListenerForLostOpener) {
                    this._backupListenerForLostOpener = async () => {
                        window.removeEventListener('focus', this._backupListenerForLostOpener);
                        try {
                            await Server.ping();
                            this.showAuthenticationError();
                        } catch (error) {
                            console.error('Error pinging server:', error);
                            this.showNetworkError();
                        }
                    };
                }
                window.addEventListener('focus', this._backupListenerForLostOpener);
            }
        }
    }

    toggleHelp() {
        const helpContent = document.getElementById('help-content');
        const helpArrow = document.getElementById('help-arrow');
        const helpSection = document.getElementById('help-section');
        
        if (helpContent && helpArrow && helpSection) {
            const isCollapsed = helpContent.style.maxHeight === '0px' || helpContent.style.maxHeight === '';
            
            if (isCollapsed) {
                // Expand
                helpContent.style.maxHeight = helpContent.scrollHeight + 'px';
                helpArrow.style.transform = 'rotate(180deg)';
                helpSection.classList.remove('pb-2');
                helpSection.classList.add('pb-4');
            } else {
                // Collapse
                helpContent.style.maxHeight = '0px';
                helpArrow.style.transform = 'rotate(0deg)';
                helpSection.classList.remove('pb-4');
                helpSection.classList.add('pb-2');
            }
        }
    }

    handleBack() {
        PageController.showPage(PAGES.LANDING);
    }
}

export default ConnectPage;
