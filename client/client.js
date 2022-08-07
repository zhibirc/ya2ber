'use strict';

const net = require('net');
const readline = require('readline');
const util = require('util');
const config = require('../server/config');

const DEFAULT_USER_NAME = 'Anonymous';

let userName;

const client = net.createConnection({
    port: config.PORT
}, connectionListener);

const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: getPS1Value()
});

// TODO: will be required for auth later
const question = util.promisify(cli.question).bind(cli);

cli.prompt();

function connectionListener () {
    showMessage('Connect to server');
}

client.on('data', data => {
    showMessage(data.toString());
});

cli.on('line', input => {
    client.write(input);
});

function getPS1Value () {
    const currentDate = new Date()
        .toISOString()
        .replace('T', '_')
        .replace(/\..+$/, '');

    return `${currentDate} ${userName || DEFAULT_USER_NAME} > `;
}

function showMessage ( message ) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(message);
    cli.prompt(true);
}

process.on('SIGINT', () => {
    console.log('CTRL + C');
    cli.close();
    client.destroy();
});
