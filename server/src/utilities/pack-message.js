'use strict';

/**
 * Prepare data to be sent as a message.
 *
 * @param {string} message - message to send, can be one from socket (user input) or system level
 * @param {string} type - message type: 'message' or 'system'
 * @param {Object} [meta] - any optional additional information like amount of online users, is error happened, etc.
 *
 * @return {string} serialized JSON, ready to transmit
 */
function packMessage ( message, type, meta ) {
    const resultJSON = {
        message,
        type,
        ...meta
    };

    return JSON.stringify(resultJSON);
}

module.exports = packMessage;
