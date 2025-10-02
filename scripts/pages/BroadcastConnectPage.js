import BroadcastController from '../controllers/BroadcastController.js';

class BroadcastConnectPage {
    constructor() {
        this.broadcastController = BroadcastController;
        this.setupPostMessageListener();
        this.setupBroadcastListeners();
    }

    setupPostMessageListener() {
        // Listen for messages from the opener window
        window.addEventListener('message', (event) => {
            console.log('PostMessage received from opener:', event.data);
            
            if (event.data && event.data.subject) {
                switch (event.data.subject) {
                    case 'connect_available':
                        // Forward to broadcast channel
                        this.broadcastController.sendBroadcast('connect_available', true);
                        break;
                        
                    case 'connect_token':
                        // Forward token to broadcast channel
                        this.broadcastController.sendBroadcast('connect_token', event.data.token);
                        break;
                        
                    default:
                        console.log('Unknown message subject:', event.data.subject);
                }
            }
        });
    }

    setupBroadcastListeners() {
        // Listen for broadcast messages and forward to opener
        this.broadcastController.registerSubjectHandler('connect_available_reply', (message) => {
            console.log('Broadcast connect_available_reply received:', message);
            this.sendToOpener({
                subject: 'connect_available_reply'
            });
        });

        this.broadcastController.registerSubjectHandler('connect_token_received', (message) => {
            console.log('Broadcast connect_token_received received:', message);
            this.sendToOpener({
                subject: 'connect_token_received'
            });
        });
    }

    sendToOpener(message) {
        if (window.opener && !window.opener.closed) {
            console.log('Sending message to opener:', message);
            window.opener.postMessage(message, '*');
        } else {
            console.warn('Cannot send message to opener - window is closed or not available');
        }
    }
}

let broadcastConnectPage = new BroadcastConnectPage();
export default broadcastConnectPage;
