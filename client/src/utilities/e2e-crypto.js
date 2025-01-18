/**
 * Basic set of methods for E2EE implementation.
 */

import crypto from 'node:crypto';

const { subtle, getRandomValues } = crypto.webcrypto;

// TODO: use wrapping for exported keys
async function generateKeyPair () {
    const { publicKey, privateKey } = await subtle.generateKey(
        {
            // use elliptic curve Diffie-Hellman
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        true,
        ['deriveKey', 'deriveBits']
    );

    return {
        public: await subtle.exportKey('jwk', publicKey),
        private: await subtle.exportKey('jwk', privateKey)
    };
};

async function encryptMessage ( message, key ) {
    // TODO
};

async function decryptMessage ( message, key ) {
    // TODO
};


export {
    generateKeyPair,
    encryptMessage,
    decryptMessage
}
