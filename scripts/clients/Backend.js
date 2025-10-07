import { API_URL } from '/scripts/constants/constants.js';

class Backend {
    constructor() {}

    async addToWaitlist(emailAddress, openToInterview) {
        let params = { emailAddress };
        if(openToInterview) params.openToInterview = openToInterview;
        return this._post('/waitlist/email', params);
    }

    async removeFromWaitlist(token) {
        return this._delete('/waitlist/email', { token });
    }

    async getWaitlistCount() {
        return this._get('/waitlist/count');
    }

    async _handleError(response) {
        let errorData = {
            status: response.status,
        }
        try {
            const errorBody = await response.json();
            if (errorBody) {
                errorData.body = errorBody;
            }
        } catch (e) {
            // Response wasn't JSON or didn't have a message field
        }
        throw new Error(JSON.stringify(errorData));
    }

    async _get(path, params, apiUrl = API_URL) {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const response = await fetch(apiUrl + path + queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        const data = await response.json();
        return data.data;
    }

    async _post(path, request, apiUrl = API_URL) {
        const response = await fetch(apiUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
            credentials: 'include'
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        const data = await response.json();
        return data.data;
    }

    async _delete(path, params, apiUrl = API_URL) {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const response = await fetch(apiUrl + path + queryString, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        const data = await response.json();
        return data.data;
    }
}

let backend = new Backend();
export default backend;
