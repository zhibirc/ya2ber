const icons = require('../../../icons.json');

module.exports = {
    general: {},
    auth: {
        MALFORMED_DATA: `${icons.error} unexpected input`,
        INVALID_USERNAME_LENGTH: `${icons.error} username should be in range from 4 to 20 characters`,
        INVALID_PASSWORD_FORMAT: `${icons.error} password should be in range from 12 to 40 characters and should contain letters, digits and symbols`,
        IMPOSTOR_DETECTED: `${icons.wink} please, try another username`,
        SIGNUP_SUCCESSFUL: `${icons.success} user was successfully registered`
    }
};
