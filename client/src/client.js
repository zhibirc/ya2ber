'use strict';

const net = require('net');
const readline = require('readline');
const util = require('util');
const getDate = require('./tools/get-iso8601-date');
const parseMessage = require('./tools/parse-message');

const DEFAULT_USER_NAME = 'Anonymous';

// TODO: will be required for auth later
// const question = util.promisify(cli.question).bind(cli);

class Client {
    #client;
    #port;
    #cli;
    #username;

    constructor ( port, colors) {
        this.#port = port;
        this.colors = colors;
        this.#username = DEFAULT_USER_NAME;
        this.#client = net.createConnection({
            port: this.#port
        }, () => this.showSystemMessage('Connect to server'));
        this.#cli = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.#client.on('data', data => {
            const {isSystem, message} = parseMessage(data);
            isSystem
                ? this.showSystemMessage(message)
                : this.showChatMessage(message);
        });
        this.#cli.on('line', input => {
            readline.clearLine(process.stdout, 1);
            this.#client.write(input, () => {
                readline.moveCursor(process.stdout, 0, -1);
                readline.clearScreenDown(process.stdout);
                this.showChatMessage(input, true);
            });
        });
        this.#cli.prompt();
    }

    getExtendedPrompt ( userName ) {
        return `${getDate()} ${userName} > `;
    }

    showChatMessage ( message, self ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        // TODO: after adding auth there should be username in incoming message that should be parsed as well
        self
            ? console.log(this.colors.cyan(`${this.getExtendedPrompt('me')}${message}`))
            : console.log(this.colors.green(`${this.getExtendedPrompt(DEFAULT_USER_NAME)}${message}`));

        this.#cli.prompt(true);
    }

    /**
     * Show formatted system message.
     *
     * @param {string} message - system level event
     * @param {Error} [error] - error object which causes an event
     */
    showSystemMessage ( message, error ) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        if ( error ) {
            // TODO: probably extract some useful info from error object
            console.log(this.colors.red(message));
        } else {
            console.log(this.colors.grey(message));
        }

        this.#cli.prompt(true);
    }

    exit () {
        this.#cli.close();
        this.#client.destroy();
    }
}

module.exports = Client;
