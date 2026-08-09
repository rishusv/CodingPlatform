const express = require('express');

const authRouter = express.Router();
const { register, login, logout } = require('../controllers/userController');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

module.exports = authRouter;