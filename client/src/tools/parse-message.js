'use strict';

/**
 * Parse/sanitize of given incoming message.
 *
 * @param {string|Buffer} message
 *
 * @return {Object} parsed message
 */
function parseMessage ( message ) {
    message = message.toString().trim();

    if ( /^\/(?:server|system) /i.test(message) ) {
        return {
            isSystem: true,
            message: message.slice(message.indexOf(' ')).trimStart()
        };
    }

    return {
        isSystem: false,
        message
    };
}

module.exports = parseMessage;
