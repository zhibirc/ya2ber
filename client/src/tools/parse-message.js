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
    let data;

    try {
        data = JSON.parse(input);
    } catch ( exception ) {
        console.error(exception.message);
        // TODO: think about improving error handling here
    }

    return {
        message: data.message,
        type:    data.type,
        online:  data.online,
        token:   data.token
    };
}

module.exports = parseMessage;
