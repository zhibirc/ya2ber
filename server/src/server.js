'use strict';

const net = require('net');
const parseMessage = require('./tools/parse-message');
const packMessage = require('./tools/pack-message');
const Database = require('./services/pg');
const { message: { MESSAGE, SYSTEM }, RPC: { AUTH } } = require('./types');

const db = new Database();

const connectionOptions = {
    // allowHalfOpen: true,
    // noDelay: true,
    // keepAlive: true
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

    socket.on('data', input => {
        // TODO: add handling for received fields
        const {message, type, command, token} = parseMessage(input);
        if ( type === SYSTEM ) {
            if ( command === AUTH ) {

            }
        } else {
            // TODO: rework after auth fully implementing
            // as far as we are not Echo-server, we shouldn't send message back to the sender, so multicast it
            const receivers = [...connectedClientsMap.values()].filter(item => item !== socket);
            multicast(message, receivers);
        }
    });

    socket.on('close', hadError => {
        connectedClientsMap.delete(socket);
        console.log('Client disconnected');
        broadcast('/server someone left the chat');
    });
}

function broadcast ( message ) {
    message = packMessage(message, SYSTEM, connectedClientsMap.size);

    connectedClientsMap.forEach(socket => {
        socket.write(message);
    });
}

function multicast ( message, socketList ) {
    message = packMessage(message, MESSAGE, connectedClientsMap.size);

    socketList.forEach(socket => {
        socket.write(message);
    });
}

module.exports = Server;
