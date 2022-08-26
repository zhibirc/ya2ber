const { auth: authErrors } = require('../constants/server-responses');
const Hasher = require('../tools/hasher');

const reservedPatterns = [
    /^.*admin.*$/i,
    /^.*moderator.*$/i,
    /^Anonymous$/i
];

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_+={}\[\]:;"'|\\/?.,<>-])[a-zA-Z\d`~!@#$%^&*()_+={}\[\]:;"'|\\/?.,<>-]{12,40}$/;

const USERNAME_LENGTH_RANGE = [4, 20];

/**
 *
 * @param socket
 * @param data
 * @param db
 */
async function auth ( socket, data, db ) {
    if ( !Array.isArray(data) || data.length !== 2 ) {
        return authErrors.MALFORMED_DATA;
    }
    let [login, password] = data;

    login = login.trim();
    password = password.trim();

    // check login
    const result = await db.findUser(login);

    if ( result ) { // login

    } else { // registration
        // check basic constraints for login
        if ( login.length < USERNAME_LENGTH_RANGE[0] || login.length > USERNAME_LENGTH_RANGE[1] ) {
            return authErrors.INVALID_USERNAME_LENGTH;
        } else if ( reservedPatterns.some(pattern => pattern.test(login)) ) {
            return authErrors.IMPOSTOR_DETECTED;
        }
        // check basic constraints for password
        if ( !passwordPattern.test(password) ) {
            return authErrors.INVALID_PASSWORD_FORMAT;
        }

        await db.addUser({
            user_name: login,
            password_hash: new Hasher().hash(password),
            // user_role: ROLE_USER,
            signup_date: new Date(),
            last_visit: new Date(),
            last_ip: socket.remoteAddress
        });
    }


    // TODO: add checking for typosquatting
}

module.exports = auth;
