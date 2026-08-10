const validator = require('validator');

const validate = (data) => {
    const allowedFields = ['firstName', 'lastName', 'emailId', 'password'];
    const hasAllAllowedFields = allowedFields.every((key) => Object.prototype.hasOwnProperty.call(data, key));

    if (!hasAllAllowedFields) {
        throw new Error('All fields are required');
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