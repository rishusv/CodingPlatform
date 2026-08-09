const validator = require('validator');

const validate = (data) => {
    const allowedFields = ['firstName', 'lastName', 'emailId', 'password'];
    const isAllowed = Object.keys(data).every((key) => allowedFields.includes(key));

    if (!isAllowed) {
        throw new Error('Invalid fields in the request body');
    }

    if (!data.firstName || !data.lastName || !data.emailId || !data.password) {
        throw new Error('All fields are required');
    }

    if (!validator.isEmail(data.emailId)) {
        throw new Error('Invalid email format');
    }

    if (!validator.isStrongPassword(data.password)) {
        throw new Error('Password is not strong enough');
    }
};

module.exports = validate;