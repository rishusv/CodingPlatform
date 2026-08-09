const validator = require('validator');

const validate = (data) =>{

    const mandatoryFields = ['firstName','emailId','password'];
    const isAllowed = Object.keys(data).every((key) => mandatoryFields.includes(key));
    
    if(!isAllowed){
        throw new Error("Invalid fields in the request body");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid email format");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Password is not strong enough");
    }
}

module.exports = validate;