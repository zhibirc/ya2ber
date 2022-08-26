#!/usr/bin/env node

require('dotenv').config();

const Server = require('./server');

const server = new Server(process.env.PORT);

server.start();
