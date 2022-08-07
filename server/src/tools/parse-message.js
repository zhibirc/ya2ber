'use strict';

/**
 * Parse/sanitize of given incoming message.
 *
 * @param {string|Buffer} input
 *
 * @return {Object} parsed message
 */
function parseMessage ( input ) {
    input = input.toString().trim();
    let message;

    try {
        message = JSON.parse(input);
    } catch ( exception ) {
        console.error(exception.message);
        // TODO: think about improving error handling here
    }

    // TODO: add additional sanitizing
    return message;
}

module.exports = parseMessage;
