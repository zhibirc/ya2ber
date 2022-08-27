'use strict';

const net = require('net');
const readline = require('readline');
const util = require('util');
const icons = require('../../icons.json');
const {muteStdout, unmuteStdout} = require('./tools/interceptor');
const getDate = require('./tools/get-iso8601-date');
const parseMessage = require('./tools/parse-message');
const packMessage = require('./tools/pack-message');
const { message: { AUTH, MESSAGE, SYSTEM } } = require('./types');

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
            this.showSystemMessage(`${icons.info}  connect to server\n`, false, false);
            this.execWelcomeFlow(true);
        });

        this.#client.on('data', data => {
            const {message, type, online, from, error} = parseMessage(data);

            if ( typeof online === 'number' ) {
                this.#user.environment.usersOnline = online;
                this.#cli.setPrompt(`${icons.online} ${colors.grey(online)} > `);
            }

            if ( type === AUTH ) {
                if ( error ) {
                    this.#user.name = DEFAULT_USER_NAME;
                    this.showSystemMessage(message + '\n', true);
                } else {
                    this.#user.loggedIn = true;
                }
                this.execWelcomeFlow(false);
            } else if ( type === SYSTEM ) {
                this.showSystemMessage(message, false)
            } else {
                this.showChatMessage(message, from);
            }
        });

        this.#cli.on('line', message => {
            const input = packMessage(message, MESSAGE);
            this.#client.write(input, () => {
                readline.moveCursor(process.stdout, 0, -1);
                readline.clearScreenDown(process.stdout);
                this.showChatMessage(message);
            });
        });

        this.#cli.on('history', () => {
            this.#cli.history.splice(0, 1);
        });
    }

    getExtendedPrompt ( userName ) {
        return `${getDate()} ${userName} > `;
    }

    async execWelcomeFlow ( showHeader ) {
        showHeader && console.log(this.colors.bold.yellow(`${icons.welcome} Hello, ${this.#user.name} ${icons.person}! Welcome to ya2ber!`));

        if ( this.#user.loggedIn ) {
            console.clear();
            this.showSystemMessage(`${icons.info}  connect to server\n`, false, false);
            console.log(this.colors.bold.yellow(`${icons.welcome} Hello, ${this.#user.name} ${icons.person}! Welcome to ya2ber!\n`));
            this.#cli.prompt(true);
        } else {
            showHeader && console.log(this.colors.yellow(`You can sign in if you're already registered or sign up if it's your first visit.\n`));
            try {
                const username = await this.#system.question('Username: ');

                const passwordQuery = `Password: ${icons.secure} `;
                const handler = muteStdout(this.#cli, passwordQuery);
                const password = await this.#system.question(passwordQuery);
                unmuteStdout(this.#cli, handler);
                const input = packMessage([username, password], AUTH);
                this.#user.name = username;
                this.#client.write(input, () => {
                    readline.moveCursor(process.stdout, 0, 1);
                });
            } catch {}
        }
    }

    showChatMessage ( message, from ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        // TODO: after adding auth there should be username in incoming message that should be parsed as well
        from
            ? console.log(this.colors.green(`${this.getExtendedPrompt(from)}${message}`))
            : console.log(this.colors.cyan(`${this.getExtendedPrompt('me')}${message}`));

        this.#cli.prompt(true);
    }

    /**
     * Show formatted system message.
     *
     * @param {string} message - system level event
     * @param {boolean} isError - whether the received message should be treated as an error
     * @param {boolean} [showPrompt=true] - should CLI prompt be shown or not
     */
    showSystemMessage ( message, isError, showPrompt = true ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        if ( isError ) {
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
