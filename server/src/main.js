#!/usr/bin/env node

const Server = require('./server');

require('dotenv').config();

const server = new Server(process.env.PORT);

server.start();
