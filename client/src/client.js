'use strict';

const net = require('net');
const readline = require('readline');
const util = require('util');
const getDate = require('./tools/get-iso8601-date');
const parseMessage = require('./tools/parse-message');
const packMessage = require('./tools/pack-message');

const DEFAULT_USER_NAME = 'Anonymous';

const messageTypes = {
    MESSAGE: 'message',
    SYSTEM:  'system'
};

class Client {
    #userData;
    #client;
    #system;

    constructor ( port, colors ) {
        this.colors = colors;

        this.#userData = {
            userName: DEFAULT_USER_NAME,
            loggedIn: false,
            environment: {
                usersOnline: null
            }
        };

        this.#system = {
            port,
            cli: readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
        };
        this.#system.question = util.promisify(this.#system.cli.question).bind(this.#system.cli);

        this.#client = net.createConnection({
            port: this.#system.port
        }, () => {
            this.showSystemMessage('Connect to server\n', null, false);
            this.#userData.loggedIn || this.showWelcomeFlow();
        });

        this.#client.on('data', data => {
            const {message, isSystem, online, token} = parseMessage(data);
            this.#userData.environment.usersOnline = online;
            this.#system.cli.setPrompt(`(online: ${online}) > `);
            isSystem
                ? this.showSystemMessage(message)
                : this.showChatMessage(message);
        });
        this.#system.cli.on('line', message => {
            const input = packMessage(message, messageTypes.MESSAGE, '', '');
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

    async showWelcomeFlow () {
        console.log(this.colors.bold.yellow(`👋 Hello, ${DEFAULT_USER_NAME} 👤! Welcome to ya2ber!`));
        console.log(this.colors.underline.yellow(`You can sign in if you're already registered or sign up if it's your first visit.\n`));

        try {
            const username = await this.#system.question('Username: ');
            const password = await this.#system.question('Password: ');
            console.log(username, password);
        } catch {}

        this.#system.cli.prompt();
    }

    showChatMessage ( message, self ) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        // TODO: after adding auth there should be username in incoming message that should be parsed as well
        self
            ? console.log(this.colors.cyan(`${this.getExtendedPrompt('me')}${message}`))
            : console.log(this.colors.green(`${this.getExtendedPrompt(DEFAULT_USER_NAME)}${message}`));

        this.#system.cli.prompt(true);
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

        showPrompt && this.#system.cli.prompt(true);
    }

    exit () {
        this.#system.cli.close();
        this.#client.destroy();
    }
}

module.exports = Client;
