'use strict';

const net = require('net');
const parseMessage = require('./utilities/parse-message');
const packMessage = require('./utilities/pack-message');
const Database = require('./providers/pg');
const authController = require('./controllers/auth');
const { message: { AUTH, MESSAGE, SYSTEM }} = require('./constants/types');

const db = new Database();

const connectionOptions = {
    // allowHalfOpen: true,
    // noDelay: true,
    // keepAlive: true
};

/**
 * Store client socket connections mapped to unique user identity info.
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
            console.log(`server started and bound to port ${this.#port}`);
        });
    }
}

function onConnection ( socket ) {
    connectedClientsMap.set(socket, socket);
    console.log(`+ client connected`);

    socket.on('data', async input => {
        console.log(input.toString());

        // TODO: add handling for received fields
        const {message, type, command} = parseMessage(input);
        if ( type === AUTH ) {
            const authData = await authController(socket, message, db);

            if ( !authData.error ) {
                connectedClientsMap.set(socket, {username: authData.username});
            }

            unicast(socket, authData.message, AUTH, authData.error);
        } else {
            // TODO: rework after auth fully implementing
            // as far as we are not Echo-server, we shouldn't send message back to the sender, so multicast it
            const receivers = [...connectedClientsMap.keys()].filter(item => item !== socket);
            // we serve only authorized clients
            multicast(receivers, message, MESSAGE, connectedClientsMap.get(socket).username);
        }
    });

    socket.on('close', hadError => {
        const userName = connectedClientsMap.get(socket).username;
        connectedClientsMap.delete(socket);
        console.log('- client disconnected');
        broadcast(`${userName} left the chat`, SYSTEM);
    });
}

function broadcast ( message, type ) {
    message = packMessage(message, type, {online: connectedClientsMap.size});

    connectedClientsMap.forEach((_, socket) => {
        socket.write(message);
    });
}

function multicast ( socketList, message, type, from ) {
    message = packMessage(message, type, {online: connectedClientsMap.size, from});

    socketList.forEach(socket => {
        socket.write(message);
    });
}

function unicast ( socket, message, type, error ) {
    const meta = {error};
    error || (meta.online = connectedClientsMap.size);
    message = packMessage(message, type, meta);
    socket.write(message);
}

module.exports = Server;
