'use strict';

/**
 * Prepare data to be sent as a message.
 *
 * @param {string} message - message to send, can be one from STDIN (user input) or system level
 * @param {string} type - message type: 'message' or 'system'
 * @param {string} command - command to execute remotely
 * @param {string} token
 *
 * @return {string} serialized JSON, ready to transmit
 */
function packMessage ( message, type, command, token ) {
    const resultJSON = {
        message,
        type,
        command,
        token
    };

    return JSON.stringify(resultJSON);
}

module.exports = packMessage;
