/**
 * Prepare data to be sent as a message.
 *
 * @param {string|string[]} message - message to send, can be one from STDIN (user input) or system level
 * @param {string} type - message type: 'message' or 'system'
 * @param {Object} [meta] - any optional additional information
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


export default packMessage;
