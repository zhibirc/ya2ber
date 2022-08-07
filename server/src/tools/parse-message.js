'use strict';

/**
 * Parse/sanitize of given incoming message.
 *
 * @param {string|Buffer} message
 *
 * @return {string} parsed message
 */
function parseMessage ( message ) {
    // TODO: currently it's an identity function, should be replaced with some parsing algorithm
    return message;
}

module.exports = parseMessage;
