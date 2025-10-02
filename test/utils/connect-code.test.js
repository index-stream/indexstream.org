import { test, describe } from 'node:test';
import assert from 'node:assert';
import { decompressConnectCode } from '../../scripts/utils/connect-code.js';

describe('decompressConnectCode', () => {
    describe('Format A - 192.168.0.x', () => {
        test('should decode basic format A connect code', () => {
            const result = decompressConnectCode('ABC');
            assert.strictEqual(result.ip, '192.168.0.26');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format A with different port offset', () => {
            const result = decompressConnectCode('ABCB');
            assert.strictEqual(result.ip, '192.168.0.26');
            assert.strictEqual(result.port, 8444);
        });

        test('should decode format A with maximum IP value', () => {
            const result = decompressConnectCode('ALR');
            assert.strictEqual(result.ip, '192.168.0.255');
            assert.strictEqual(result.port, 8443);
        });

        test('should handle format A with 2-character port', () => {
            const result = decompressConnectCode('ABCAZ');
            assert.strictEqual(result.ip, '192.168.0.26');
            assert.strictEqual(result.port, 8443 + 23); // 8466 (A=0, Z=23, so AZ = 0*24 + 23 = 23)
        });
    });

    describe('Format B - 192.168.1.x', () => {
        test('should decode basic format B connect code', () => {
            const result = decompressConnectCode('BAA');
            assert.strictEqual(result.ip, '192.168.1.0');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format B with different IP', () => {
            const result = decompressConnectCode('BBC');
            assert.strictEqual(result.ip, '192.168.1.26');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format B with port offset', () => {
            const result = decompressConnectCode('BBCC');
            assert.strictEqual(result.ip, '192.168.1.26');
            assert.strictEqual(result.port, 8445); // C=2
        });
    });

    describe('Format C - 10.x.x.x', () => {
        test('should decode basic format C connect code', () => {
            const result = decompressConnectCode('CAAAAAA');
            assert.strictEqual(result.ip, '10.0.0.0');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format C with different IP parts', () => {
            const result = decompressConnectCode('CABABAB');
            assert.strictEqual(result.ip, '10.1.1.1');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format C with port offset', () => {
            const result = decompressConnectCode('CAAAAAAC');
            assert.strictEqual(result.ip, '10.0.0.0');
            assert.strictEqual(result.port, 8445);
        });

        test('should decode format C with maximum values', () => {
            const result = decompressConnectCode('CLRLRLR');
            assert.strictEqual(result.ip, '10.255.255.255');
            assert.strictEqual(result.port, 8443);
        });
    });

    describe('Format D - 172.x.x.x', () => {
        test('should decode basic format D connect code', () => {
            const result = decompressConnectCode('DAAAAAA');
            assert.strictEqual(result.ip, '172.0.0.0');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format D with different IP parts', () => {
            const result = decompressConnectCode('DACACACCC');
            assert.strictEqual(result.ip, '172.2.2.2');
            assert.strictEqual(result.port, 8493); // CCC = 2*24^2 + 2*24 + 2 = 1152 + 48 + 2 = 1202, but only 3 chars for port = 50
        });

        test('should decode format D with port offset', () => {
            const result = decompressConnectCode('DAAAAAAD');
            assert.strictEqual(result.ip, '172.0.0.0');
            assert.strictEqual(result.port, 8443 + 3); // 8446
        });
    });

    describe('Format F - No compression', () => {
        test('should decode basic format F connect code', () => {
            const result = decompressConnectCode('FAAAAAAAA');
            assert.strictEqual(result.ip, '0.0.0.0');
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format F with different IP', () => {
            const result = decompressConnectCode('FBBBBBBBB');
            assert.strictEqual(result.ip, '25.25.25.25'); // BB = 1*24 + 1 = 25
            assert.strictEqual(result.port, 8443);
        });

        test('should decode format F with port offset', () => {
            const result = decompressConnectCode('FAAAAAAAAF');
            assert.strictEqual(result.ip, '0.0.0.0');
            assert.strictEqual(result.port, 8443 + 5); // 8448
        });

        test('should decode format F with 4-character absolute port', () => {
            const result = decompressConnectCode('FAAAAAAAAAAAA');
            // AAAA in base24 = 0*24^3 + 0*24^2 + 0*24 + 0 = 0
            assert.strictEqual(result.ip, '0.0.0.0');
            assert.strictEqual(result.port, 0); // Absolute port
        });
    });

    describe('Port decoding - ports less than default', () => {
        test('should handle port 80 with 4-character encoding', () => {
            const result = decompressConnectCode('AAAAADJ'); // A + AA + AADJ = 192.168.0.0 + port 80
            assert.strictEqual(result.ip, '192.168.0.0');
            assert.strictEqual(result.port, 80);
        });

        test('should handle port 443 with 4-character encoding', () => {
            const result = decompressConnectCode('AAAAAUM'); // A + AA + AAUM = 192.168.0.0 + port 443
            assert.strictEqual(result.ip, '192.168.0.0');
            assert.strictEqual(result.port, 443);
        });

        test('should handle port 3000 with 4-character encoding', () => {
            const result = decompressConnectCode('AAAAFFA'); // A + AA + AFFA = 192.168.0.0 + port 3000
            assert.strictEqual(result.ip, '192.168.0.0');
            assert.strictEqual(result.port, 3000);
        });
    });

    describe('Port decoding - ports greater than default', () => {
        test('should handle empty port string (default port)', () => {
            const result = decompressConnectCode('ABC');
            assert.strictEqual(result.port, 8443);
        });

        test('should handle 1-character port offset', () => {
            const result = decompressConnectCode('ABCB');
            assert.strictEqual(result.port, 8444); // AB = 0*24 + 1 = 1, so 8443 + 1 = 8444
        });

        test('should handle 2-character port offset', () => {
            const result = decompressConnectCode('ABCBA');
            assert.strictEqual(result.port, 8467); // BA = 1*24 + 0 = 24, so 8443 + 24 = 8467
        });

        test('should handle 3-character port offset', () => {
            const result = decompressConnectCode('ABCBC');
            assert.strictEqual(result.port, 8469); // BC = 1*24 + 2 = 26, so 8443 + 26 = 8469
        });

        test('should handle 4-character absolute port', () => {
            const result = decompressConnectCode('ABCABCD');
            assert.strictEqual(result.port, 627); // ABCD = 0*24^3 + 1*24^2 + 2*24 + 3 = 0 + 576 + 48 + 3 = 627
        });

        test('should demonstrate difference between 2-char offset and 4-char absolute', () => {
            // DJ as 2-character offset: 8443 + 80 = 8523
            const result2char = decompressConnectCode('AAADJ');
            assert.strictEqual(result2char.port, 8523);
            
            // AADJ as 4-character absolute: port 80
            const result4char = decompressConnectCode('AAAAADJ');
            assert.strictEqual(result4char.port, 80);
        });
    });

    describe('Error cases', () => {
        test('should throw error for empty connect code', () => {
            assert.throws(() => decompressConnectCode(''), /Invalid connect code: empty or too short/);
        });

        test('should throw error for null connect code', () => {
            assert.throws(() => decompressConnectCode(null), /Invalid connect code: empty or too short/);
        });

        test('should throw error for undefined connect code', () => {
            assert.throws(() => decompressConnectCode(undefined), /Invalid connect code: empty or too short/);
        });

        test('should throw error for invalid format character', () => {
            assert.throws(() => decompressConnectCode('GABC'), /Invalid connect code format: G/);
        });

        test('should throw error for format E (not implemented)', () => {
            assert.throws(() => decompressConnectCode('EABC'), /External connection format \(E\) not implemented yet/);
        });

        test('should throw error for format A with insufficient characters', () => {
            assert.throws(() => decompressConnectCode('A'), /Invalid connect code: format A requires at least 2 characters/);
        });

        test('should throw error for format C with insufficient characters', () => {
            assert.throws(() => decompressConnectCode('CAAAAA'), /Invalid connect code: format C requires at least 6 characters/);
        });

        test('should throw error for format D with insufficient characters', () => {
            assert.throws(() => decompressConnectCode('DAAAAA'), /Invalid connect code: format D requires at least 6 characters/);
        });

        test('should throw error for format F with insufficient characters', () => {
            assert.throws(() => decompressConnectCode('FAAAAAAA'), /Invalid connect code: format F requires at least 8 characters/);
        });

        test('should throw error for invalid base24 character', () => {
            assert.throws(() => decompressConnectCode('A0C'), /Invalid base24 character: 0/);
        });

        test('should throw error for invalid base24 character (I)', () => {
            assert.throws(() => decompressConnectCode('AIC'), /Invalid base24 character: I/);
        });

        test('should throw error for invalid base24 character (O)', () => {
            assert.throws(() => decompressConnectCode('AOC'), /Invalid base24 character: O/);
        });
    });

    describe('Edge cases', () => {
        test('should handle case insensitive format character', () => {
            const result1 = decompressConnectCode('abc');
            const result2 = decompressConnectCode('ABC');
            assert.strictEqual(result1.ip, result2.ip);
            assert.strictEqual(result1.port, result2.port);
        });

        test('should handle minimum valid connect codes', () => {
            const resultA = decompressConnectCode('AAA');
            const resultB = decompressConnectCode('BAA');
            const resultC = decompressConnectCode('CAAAAAA');
            const resultD = decompressConnectCode('DAAAAAA');
            const resultF = decompressConnectCode('FAAAAAAAA');
            
            assert.strictEqual(resultA.ip, '192.168.0.0');
            assert.strictEqual(resultB.ip, '192.168.1.0');
            assert.strictEqual(resultC.ip, '10.0.0.0');
            assert.strictEqual(resultD.ip, '172.0.0.0');
            assert.strictEqual(resultF.ip, '0.0.0.0');
        });

        test('should handle maximum valid connect codes', () => {
            const resultA = decompressConnectCode('ALR');
            const resultB = decompressConnectCode('BLR');
            const resultC = decompressConnectCode('CLRLRLR');
            const resultD = decompressConnectCode('DLRLRLR');
            const resultF = decompressConnectCode('FLRLRLRLR');
            
            assert.strictEqual(resultA.ip, '192.168.0.255');
            assert.strictEqual(resultB.ip, '192.168.1.255');
            assert.strictEqual(resultC.ip, '10.255.255.255');
            assert.strictEqual(resultD.ip, '172.255.255.255');
            assert.strictEqual(resultF.ip, '255.255.255.255');
        });
    });
});
