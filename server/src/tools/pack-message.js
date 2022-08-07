'use strict';

/**
 * Prepare data to be sent as a message.
 *
 * @param {string} message - message to send, can be one from socket (user input) or system level
 * @param {string} type - message type: 'message' or 'system'
 * @param {number} usersOnline - number of users online
 *
 * @return {string} serialized JSON, ready to transmit
 */
function packMessage ( message, type, usersOnline ) {
    const resultJSON = {
        message,
        type,
        online: usersOnline,
        token: ''
    };

    return JSON.stringify(resultJSON);
}

module.exports = packMessage;
