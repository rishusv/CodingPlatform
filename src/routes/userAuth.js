const express = require('express');

const authRouter = express.Router();
const { register, login, logout } = require('../controllers/userController');
const userMiddleware = require('../middleware/userMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);

module.exports = authRouter;