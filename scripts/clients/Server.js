import { IS_DEV, IS_LOCAL } from '../constants/constants.js';
const DEFAULT_TIMEOUT = 5000;

class Server {
    constructor() {
        this._serverUrl = localStorage.getItem('serverUrl');
        this._serverId = localStorage.getItem('serverId');
        if(this._serverUrl) this._apiUrl = this._serverUrl + 'api';
        if(IS_DEV) this._serverUrl += '?dev=' + ((IS_LOCAL) ? 'local' : 'true');
    }

    getServerUrl() {
        return this._serverUrl;
    }

    getServerId() {
        return this._serverId;
    }

    getServerName() {
        return this._serverName;
    }

    getProfiles() {
        return this._profiles;
    }

    setToken(token) {
        this._token = token;
    }

    setServer(ip, port) {
        const url = `https://${ip}:${port}/`;
        this._serverUrl = url;
        this._apiUrl = url + 'api';
        localStorage.setItem('serverUrl', url);
    }

    setServerId(serverId) {
        this._serverId = serverId;
        localStorage.setItem('serverId', serverId);
    }

    setServerName(serverName) {
        this._serverName = serverName;
    }

    setProfiles(profiles) {
        this._profiles = profiles;
    }

    async ping() {
        return this._get('/ping');
    }

    async getConfig() {
        return this._getAuthenticated('/config');
    }

    async checkToken(token) {
        return this._get('/token', { token });
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

    async _get(path, params, apiUrl = this._apiUrl) {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
        const response = await fetch(apiUrl + path + queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }

    async _getAuthenticated(path, params, apiUrl = this._apiUrl) {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const response = await fetch(apiUrl + path + queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this._token}`
            },
        });
        
        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }

    async _post(path, request, apiUrl = this._apiUrl) {
        const response = await fetch(apiUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }

    async _postAuthenticated(path, request, apiUrl = this._apiUrl) {
        const response = await fetch(apiUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this._token}`
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }

    async _putAuthenticated(path, request, apiUrl = this._apiUrl) {
        const response = await fetch(apiUrl + path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this._token}`
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }

    async _delete(path, params, apiUrl = this._apiUrl) {
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
        return await response.json();
    }

    async _deleteAuthenticated(path, params, apiUrl = this._apiUrl) {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const response = await fetch(apiUrl + path + queryString, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this._token}`
            },
        });

        if (!response.ok) {
            await this._handleError(response);
        }
        return await response.json();
    }
}

let server = new Server();
export default server;