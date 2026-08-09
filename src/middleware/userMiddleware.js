const jwt = require('jsonwebtoken');
const User = require('../models/users');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies || {};

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev-secret');
        const { _id } = payload;

        if (!_id) {
            throw new Error('Invalid token: Missing user ID');
        }

        const result = await User.findById(_id);

        if (!result) {
            throw new Error('User not found');
        }

        // Redis blocklist check: look for the exact token key
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error('Token is blocked');
        }

        req.result = result; // Attach user info to request object for further use
        next();
    } catch (err) {
        console.error('Error :', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = userMiddleware;