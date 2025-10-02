// Page names enum
export const PAGES = {
    INITIAL: 'initial',
    LANDING: 'landing',
    CONNECT: 'connect',
    HOME: 'home'
};

export const DEFAULT_SERVER_PORT = 8443;

//check if url is index.stream
const url = new URL(window.location.href);
export const IS_DEV = url.hostname != 'indexstream.org';
export const IS_LOCAL = !url.hostname.includes('indexstream.org');
