
/**
 * @fileoverview Entry point for the client application.
 * Initializes and starts the client, sets up signal handlers for graceful shutdown.
 */
import colors from 'colors/safe.js';
import Client from './main.js';
import config from './config/index.js';

console.clear();

const client = new Client({
    port: config.SERVER_PORT,
    colors
});

client.connect();

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

function handleShutdown () {
    client.exit((error) => {
        process.exit(0);
    });
}
