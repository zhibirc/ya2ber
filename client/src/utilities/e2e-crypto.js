/**
 * Basic set of methods for E2EE implementation.
 */

const { subtle, getRandomValues } = require('crypto').webcrypto;

// TODO: use wrapping for exported keys
exports.generateKeyPair = async function () {
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

exports.encryptMessage = async function ( message, key ) {
    // TODO
};

exports.decryptMessage = async function ( message, key ) {
    // TODO
};
