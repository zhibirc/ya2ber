'use strict';

const net = require('net');
const parseMessage = require('./utilities/parse-message');
const packMessage = require('./utilities/pack-message');
const Database = require('./providers/pg');
const authController = require('./controllers/auth');
const { message: { MESSAGE, SYSTEM }, RPC: { AUTH } } = require('./constants/types');

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
    console.log(`+ client connected`);

    socket.on('data', async input => {
        // TODO: add handling for received fields
        const {message, type, command} = parseMessage(input);
        if ( type === SYSTEM ) {
            if ( command === AUTH ) {
                const authData = await authController(socket, message, db);
                unicast(socket, authData.message, SYSTEM, authData.error);
            }
        } else {
            // TODO: rework after auth fully implementing
            // as far as we are not Echo-server, we shouldn't send message back to the sender, so multicast it
            const receivers = [...connectedClientsMap.values()].filter(item => item !== socket);
            multicast(receivers, message, MESSAGE);
        }
    });

    socket.on('close', hadError => {
        connectedClientsMap.delete(socket);
        console.log('- client disconnected');
        broadcast('someone left the chat', SYSTEM);
    });
}

function broadcast ( message, type ) {
    message = packMessage(message, type, {online: connectedClientsMap.size});

    connectedClientsMap.forEach(socket => {
        socket.write(message);
    });
}

function multicast ( socketList, message, type ) {
    message = packMessage(message, type, {online: connectedClientsMap.size});

    socketList.forEach(socket => {
        socket.write(message);
    });
}

function unicast ( socket, message, type, error ) {
    message = packMessage(message, type, {online: connectedClientsMap.size, error});
    socket.write(message);
}

module.exports = Server;
