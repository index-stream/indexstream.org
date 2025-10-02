// Decompress connect code into IP address and port
// 
// Connect Code Format:
// The first character dictates the compression format:
// A - 192.168.0.x, followed by 2 *s (where * represents base24 characters)
// B - 192.168.1.x, followed by 2 *s  
// C - 10.x.x.x, followed by 6 *s
// D - 172.x.x.x, followed by 6 *s
// E - external connection via server (not implemented yet)
// F - no compression, followed by 8 *s
// 
// Port compression:
// If port < DEFAULT_SERVER_PORT: 4 characters (absolute port, left-padded with A if necessary)
// If port >= DEFAULT_SERVER_PORT and port < DEFAULT_SERVER_PORT + 24: 1 character
// If port >= DEFAULT_SERVER_PORT and port < DEFAULT_SERVER_PORT + 24^2: 2 characters  
// If port >= DEFAULT_SERVER_PORT and port < DEFAULT_SERVER_PORT + 24^3: 3 characters
// Otherwise: 4 characters (absolute port)

import { DEFAULT_SERVER_PORT } from '../constants/constants.js';

// Base24 character mapping (24 characters: A-H, J-N, P-Z, excluding I and O to avoid confusion with 1 and 0)
const BASE24_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

function base24Decode(str) {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i].toUpperCase();
        const value = BASE24_CHARS.indexOf(char);
        if (value === -1) {
            throw new Error(`Invalid base24 character: ${char}`);
        }
        result = result * 24 + value;
    }
    return result;
}

function base24DecodeIPOctet(str) {
    const result = base24Decode(str);
    // Cap IP octet values at 255
    return Math.min(result, 255);
}

function decodePort(portStr, defaultPort = DEFAULT_SERVER_PORT) {
    if (!portStr || portStr.length === 0) {
        return defaultPort;
    }
    
    const portValue = base24Decode(portStr);
    
    // If port string is 4 characters, it's an absolute port
    // This handles ports < DEFAULT_SERVER_PORT (left-padded with A if necessary)
    if (portStr.length === 4) {
        return portValue;
    }
    
    // For 1-3 characters, it's an offset from the default port
    // This handles ports >= DEFAULT_SERVER_PORT and < DEFAULT_SERVER_PORT + 24^3
    return defaultPort + portValue;
}

export function decompressConnectCode(connectCode) {
    if (!connectCode || connectCode.length < 1) {
        throw new Error('Invalid connect code: empty or too short');
    }
    
    const firstChar = connectCode[0].toUpperCase();
    const remainingCode = connectCode.slice(1);
    
    let ip = null;
    let port = DEFAULT_SERVER_PORT;
    
    switch (firstChar) {
        case 'A': {
            // 192.168.0.x, followed by 2 characters for IP, then port
            if (remainingCode.length < 2) {
                throw new Error('Invalid connect code: format A requires at least 2 characters');
            }
            const ipPart = base24DecodeIPOctet(remainingCode.slice(0, 2));
            const portPart = remainingCode.slice(2);
            ip = `192.168.0.${ipPart}`;
            port = decodePort(portPart);
            break;
        }
        
        case 'B': {
            // 192.168.1.x, followed by 2 characters for IP, then port
            if (remainingCode.length < 2) {
                throw new Error('Invalid connect code: format B requires at least 2 characters');
            }
            const ipPart = base24DecodeIPOctet(remainingCode.slice(0, 2));
            const portPart = remainingCode.slice(2);
            ip = `192.168.1.${ipPart}`;
            port = decodePort(portPart);
            break;
        }
        
        case 'C': {
            // 10.x.x.x, followed by 6 characters for IP (2 per octet), then port
            if (remainingCode.length < 6) {
                throw new Error('Invalid connect code: format C requires at least 6 characters');
            }
            const ipParts = [
                base24DecodeIPOctet(remainingCode.slice(0, 2)),
                base24DecodeIPOctet(remainingCode.slice(2, 4)),
                base24DecodeIPOctet(remainingCode.slice(4, 6))
            ];
            const portPart = remainingCode.slice(6);
            ip = `10.${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
            port = decodePort(portPart);
            break;
        }
        
        case 'D': {
            // 172.x.x.x, followed by 6 characters for IP (2 per octet), then port
            if (remainingCode.length < 6) {
                throw new Error('Invalid connect code: format D requires at least 6 characters');
            }
            const ipParts = [
                base24DecodeIPOctet(remainingCode.slice(0, 2)),
                base24DecodeIPOctet(remainingCode.slice(2, 4)),
                base24DecodeIPOctet(remainingCode.slice(4, 6))
            ];
            const portPart = remainingCode.slice(6);
            ip = `172.${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
            port = decodePort(portPart);
            break;
        }
        
        case 'E': {
            // External connection via server (not implemented yet)
            throw new Error('External connection format (E) not implemented yet');
        }
        
        case 'F': {
            // No compression, followed by 8 characters for IP, then port
            if (remainingCode.length < 8) {
                throw new Error('Invalid connect code: format F requires at least 8 characters');
            }
            const ipParts = [
                base24DecodeIPOctet(remainingCode.slice(0, 2)),
                base24DecodeIPOctet(remainingCode.slice(2, 4)),
                base24DecodeIPOctet(remainingCode.slice(4, 6)),
                base24DecodeIPOctet(remainingCode.slice(6, 8))
            ];
            const portPart = remainingCode.slice(8);
            ip = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3]}`;
            port = decodePort(portPart);
            break;
        }
        
        default:
            throw new Error(`Invalid connect code format: ${firstChar}. Must be A, B, C, D, E, or F.`);
    }
    
    return { ip, port };
}