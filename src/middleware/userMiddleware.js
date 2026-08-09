const jwt = require('jsonwebtoken');

const userMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'dev-secret'); 

        const {_id} = payload;

        if (!_id) {
            throw new Error('Invalid token: Missing user ID');
        }
        const result = User.findById(_id);

        if(!result){
            throw new Error('User not found');
        }
        
        //Redis blocklist check can be added here to check if the token is blacklisted

        const isBlocked = await redisClient.exists(`token:{token}`);
        if (isBlocked) {
            throw new Error('Token is blocked');
        }
        
        req.result = result; // Attach user info to request object for further use
        next();
        
    }
    catch (err) {
        console.error('Error :', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

};

module.exports = userMiddleware;