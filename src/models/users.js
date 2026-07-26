const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 10
    },
    lastName: {
        ype: String,
        required: true,
        minLength: 3,
        maxLenght: 10
    },
    email: {
        type: String,
        equired: true,
        unique: true,
        trim: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 5,
        max: 80
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [String]
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

module.exports = User;