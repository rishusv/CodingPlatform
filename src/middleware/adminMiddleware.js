const jwt = require('jsonwebtoken');
const User = require('../models/users');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    try{
        const { token } = req.cookies || {};

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { _id, emailId, role } = payload;

        if(!_id)
        {
            throw new Error('Invalid token: Missing user ID');
        }

        const result = await User.findById(_id);
        
        if (!result) {
            throw new Error('User not found');
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error('Invalid token');
        }

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        next();
    }
    catch(err){
        console.error('Error :', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  
};

module.exports = adminMiddleware;