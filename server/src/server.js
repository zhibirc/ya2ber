'use strict';

const net = require('net');
const parseMessage = require('./tools/parse-message');

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
        // as far as we are not Echo-server, we shouldn't send message back to the sender, so multicast it
        const receivers = [...connectedClientsMap.values()].filter(item => item !== socket);
        multicast(message, receivers);
    });

    socket.on(socketEvents.DISCONNECT, hadError => {
        connectedClientsMap.delete(socket);
        console.log('Client disconnected');
        broadcast('/server someone left the chat');
    });
}

function broadcast ( message ) {
    connectedClientsMap.forEach(socket => {
        socket.write(message);
    });
}

function multicast ( message, socketList ) {
    socketList.forEach(socket => {
        socket.write(message);
    });
}

module.exports = Server;
