'use strict';

const colors = require('colors/safe');
const Client = require('./client');
const config = require('./config');

console.clear();

const client = new Client(config.PORT, colors);

// CTRL + C
process.on('SIGINT', () => {
    client.exit();
});
