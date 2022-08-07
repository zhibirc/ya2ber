'use strict';

const net = require('net');
const parseMessage = require('./parse-message');

const connectionOptions = {
    // allowHalfOpen: true,
    // noDelay: true,
    // keepAlive: true
};

const socketEvents = {
    MESSAGE:    'data',
    DISCONNECT: 'close'
};

/**
 * Store client socket connections.
 * Could be used to indicate how many active clients are connected at the moment.
 * @type {Map}
 */
const connectedClientsMap = new Map();

class Server {
    #server;
    #port;

    constructor ( port ) {
        this.#server = net.createServer(connectionOptions, onConnection);
        this.#port = port;
    }

    start () {
        this.#server.listen(this.#port, () => {
            console.log(`Server started and bound to port ${this.#port}`);
        });
    }
}

function onConnection ( socket ) {
    connectedClientsMap.set(socket, socket);
    console.log(`Client connected`);

    socket.on(socketEvents.MESSAGE, message => {
        // TODO: replace passing through with actual parsing/sanitization
        message = parseMessage(message);
        multicast(message);
    });

    socket.on(socketEvents.DISCONNECT, hadError => {
        connectedClientsMap.delete(socket);
        console.log('Client disconnected');
        multicast('[Server] someone left the chat');
    });
}

function multicast ( message ) {
    connectedClientsMap.forEach(socket => {
        socket.write(message);
    });
}

module.exports = Server;
