/**
 * Basic set of methods for E2EE implementation.
 */

const { subtle } = require('crypto').webcrypto;

// TODO: use wrapping for exported keys
exports.generateKeyPair = async function () {
    const { publicKey, privateKey } = await subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"]
    );

    const publicKeyJwk = await subtle.exportKey(
        "jwk",
        publicKey
    );

    const privateKeyJwk = await subtle.exportKey(
        "jwk",
        privateKey
    );

    return { publicKeyJwk, privateKeyJwk };
};

exports.encryptMessage = async function ( message, key ) {
    return crypto.sign(null, Buffer.from(message), key);
};
