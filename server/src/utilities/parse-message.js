'use strict';

/**
 * Parse/sanitize of given incoming message.
 *
 * @param {string|Buffer} input
 * @example
 * '{"message":["john","12345"],"type":"auth"}'
 *
 * @return {Object} parsed message
 */
function parseMessage ( input ) {
    input = input.toString().trim();
    let data;

    try {
        data = JSON.parse(input);
    } catch ( exception ) {
        console.error(exception.message);
        // TODO: think about improving error handling here
    }

    // TODO: add additional sanitizing
    return {
        message: data.message,
        type:    data.type,
        command: data.command
    };
}

module.exports = parseMessage;
