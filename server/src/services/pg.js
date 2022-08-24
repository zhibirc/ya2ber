const { Pool } = require('pg');
const errorCodes = require('./pgErrorCodes');

class Pg {
    #pool;
    #logger;

    constructor ( config, logger ) {
        this.#pool = new Pool({
            user:     process.env.DATABASE_USER,
            host:     process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            port:     process.env.DATABASE_PORT
        });
        this.#logger = logger || console;
    }

    async #query ( sqlText, params ) {
        try {
            const start = Date.now();
            const result = await this.#pool.query(sqlText, params);

            this.#logger.info(`Request "${sqlText}" completed in ${Date.now() - start}ms.`);

            return result;
        } catch ( exception ) {
            const error = errorCodes[exception.code];

            error && this.#logger.error(`General error: ${error}.`);
            this.#logger.error(exception);

            throw exception;
        }
    }

    async findUser ( userName ) {
        const result = await this.#query('SELECT user_name from users WHERE user_name = $1', [userName]);

        return result ? result?.rows[0] : null;
    }
}

module.exports = Pg;
