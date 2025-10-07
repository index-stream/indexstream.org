import * as DEV_CONSTANTS from './dev_constants.js';
import * as PROD_CONSTANTS from './prod_constants.js';

// Page names enum
export const PAGES = {
    INITIAL: 'initial',
    CONNECT: 'connect',
    PROFILES: 'profiles',
    INDEXES: 'indexes',
    HOME: 'home'
};

export const DEFAULT_SERVER_PORT = 8443;

//check if url is index.stream
const url = new URL(window.location.href);
export const IS_DEV = url.hostname != 'indexstream.org';
export const IS_LOCAL = !url.hostname.includes('indexstream.org');

let CONSTANTS;

if(IS_DEV) {
    CONSTANTS = DEV_CONSTANTS;
} else {
    CONSTANTS = PROD_CONSTANTS;
}
export const API_URL = CONSTANTS.API_URL;