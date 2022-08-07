#!/usr/bin/env node

const config = require('./config');
const Server = require('./server');

const server = new Server(config.PORT);

server.start();
