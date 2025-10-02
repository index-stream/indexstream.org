class BroadcastController {
    constructor() {
        const url = new URL(window.location.href);
        this._broadcastId = url.searchParams.get('broadcastId') || Math.random().toString(36).substring(2, 15);
        this._broadcast = new BroadcastChannel(this._broadcastId);
        this._subjectHandlers = {};
        this._broadcast.onmessage = (event) => {
            console.log('Broadcast message received:', event.data);
            const subject = event.data.subject;
            if(this._subjectHandlers[subject]) {
                this._subjectHandlers[subject](event.data.message);
            }
        }
    }

    getBroadcastId() {
        return this._broadcastId;
    }

    sendBroadcast(subject, message) {
        this._broadcast.postMessage({ subject, message });
    }

    registerSubjectHandler(subject, callback) {
        this._subjectHandlers[subject] = callback;
    }

    unregisterSubject(subject, callback) {
        if(this._subjectHandlers[subject] === callback) {
            delete this._subjectHandlers[subject];
        }
    }
}

const broadcastController = new BroadcastController();
export default broadcastController;