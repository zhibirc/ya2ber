/**
 * Implement hashing for arbitrary data (typically, for passwords).
 *
 * Use dynamic salt for hashing. Actually, salt is building with three steps:
 * 1) There is a fixed static random sequence of pattern /^\S{20,}$/i as a base salt.
 * 2) Each "non-word" character is replaced by other character based on its UTF code multiplied by 2.
 * 3) Given salt is concatenated with the sum of all character codes in input text.
 */

const { createHash } = require('crypto');

const salt = process.env.HASH_SALT;

const getCharCodesSum = text => {
    return [...text].reduce((result, char) => result + char.charCodeAt(0), 0);
};

class Hasher {
    #salt;

    constructor () {
        this.#salt = salt.replace(/\W/g, char => String.fromCharCode(char.charCodeAt(0) << 1));
    }

    // TODO: probably, implement PBKDF specification algorithm
    hash ( text ) {
        this.#salt += getCharCodesSum(text);

        return createHash('sha256')
            .update(this.#salt.slice(0, this.#salt.length >> 1) + text + this.#salt.slice(this.#salt.length >> 1))
            .digest('hex');
    }

    verify ( text , hash ) {
        return this.hash(text) === hash;
    }
}

module.exports = Hasher;
