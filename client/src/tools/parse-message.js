'use strict';

const messageTypes = {
    MESSAGE: 'message',
    SYSTEM:  'system'
};

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

    const {message: messageText, type, online, token} = message;

    return {
        message: messageText,
        isSystem: type === messageTypes.SYSTEM,
        online,
        token
    };
}

module.exports = parseMessage;
