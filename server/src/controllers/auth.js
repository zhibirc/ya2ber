const { auth: authStatus } = require('../constants/server-responses');
const hasher = require('../utilities/hasher');

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
        return {message: authStatus.MALFORMED_DATA, error: true};
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
            return {message: authStatus.INVALID_USERNAME_LENGTH, error: true};
        } else if ( reservedPatterns.some(pattern => pattern.test(login)) ) {
            return {message: authStatus.IMPOSTOR_DETECTED, error: true};
        }
        // check basic constraints for password
        if ( !passwordPattern.test(password) ) {
            return {message: authStatus.INVALID_PASSWORD_FORMAT, error: true};
        }

        try {
            await db.addUser({
                user_name: login,
                password_hash: hasher.hash(password),
                // user_role: ROLE_USER,
                signup_date: new Date(),
                last_visit: new Date(),
                last_ip: socket.remoteAddress
            });
        } catch ( exception ) {
            console.error('error adding user');
        }

        return {message: authStatus.SIGNUP_SUCCESSFUL, username: login};
    }


    // TODO: add checking for typosquatting
}

module.exports = auth;
