'use strict';

const net = require('net');
const readline = require('readline');
const util = require('util');
const icons = require('../../icons.json');
const {muteStdout, unmuteStdout} = require('./tools/interceptor');
const getDate = require('./tools/get-iso8601-date');
const parseMessage = require('./tools/parse-message');
const packMessage = require('./tools/pack-message');
const { message: { MESSAGE, SYSTEM }, RPC: { AUTH } } = require('./types');

const DEFAULT_USER_NAME = 'Anonymous';

class Client {
    #client;
    #user;
    #system;
    #cli;

    constructor ( port, colors ) {
        this.colors = colors;

        this.#user = {
            name: DEFAULT_USER_NAME,
            loggedIn: false,
            environment: {
                usersOnline: null
            }
        };

        this.#cli = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.#system = {
            port,
            question: util.promisify(this.#cli.question).bind(this.#cli)
        };

        this.#client = net.createConnection({
            port: this.#system.port
        }, () => {
            this.showSystemMessage('Connect to server\n', null, false);
            this.#user.loggedIn || this.execWelcomeFlow();
        });

        this.#client.on('data', data => {
            const {message, type, online, token} = parseMessage(data);

            this.#user.environment.usersOnline = online;
            this.#cli.setPrompt(`(online: ${online}) > `);
            type === SYSTEM
                ? this.showSystemMessage(message)
                : this.showChatMessage(message);
        });

        this.#cli.on('line', message => {
            const input = packMessage(message, MESSAGE, '', '');
            this.#client.write(input, () => {
                readline.moveCursor(process.stdout, 0, -1);
                readline.clearScreenDown(process.stdout);
                this.showChatMessage(message, true);
            });
        });
    }

    getExtendedPrompt ( userName ) {
        return `${getDate()} ${userName} > `;
    }

    async execWelcomeFlow () {
        console.log(this.colors.bold.yellow(`${icons.welcome} Hello, ${this.#user.name} ${icons.person}! Welcome to ya2ber!`));

        if ( this.#user.loggedIn ) {

        } else {
            console.log(this.colors.yellow(`You can sign in if you're already registered or sign up if it's your first visit.\n`));
            try {
                const username = await this.#system.question('Username: ');

                const passwordQuery = `Password: ${icons.secure} `;
                const handler = muteStdout(this.#cli, passwordQuery);
                const password = await this.#system.question(passwordQuery);
                unmuteStdout(this.#cli, handler);

                // remove last entered value (password) from terminal history
                this.#cli.history.splice(0, 1);
                const input = packMessage([username, password], SYSTEM, AUTH);
                console.log(input);
                this.#client.write(input, () => {
                    // TODO
                });
            } catch {}
        }


        this.#cli.prompt();
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
     * @param {boolean} [showPrompt=true] - should CLI prompt be shown or not
     */
    showSystemMessage ( message, error, showPrompt = true ) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        if ( error ) {
            // TODO: probably extract some useful info from error object
            console.log(this.colors.red(message));
        } else {
            console.log(this.colors.grey(message));
        }

        showPrompt && this.#cli.prompt(true);
    }

    exit () {
        this.#cli.close();
        this.#client.destroy();
    }
}

module.exports = Client;
