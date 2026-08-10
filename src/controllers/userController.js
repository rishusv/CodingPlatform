const User = require('../models/users');
const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');


const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.user = "user"; // Set the role to "user" by default

        const user = await User.create({ firstName, lastName, emailId, password: hashedPassword });

        const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev-secret';
        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role:'user' }, jwtSecret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error('Error :', err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev-secret';
        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.error('Error :', err);
        res.status(400).json({ error: err.message });
    }
}

const logout = async (req, res) => {

    try {
        //validate the token - we can use middleware
        //token add in redis blocklist
        // clear the cookie
        const { token } = req.cookies; // if we reach this step it means token is valid and user is authenticated

        const payload = jwt.decode(token);
        const ttl = payload.exp - Math.floor(Date.now() / 1000);

        if (ttl > 0) {
            await redisClient.set(`token:${token}`, 'blocked', { EX: ttl });
        } // Set the token in Redis with an expiration time of 1 hour
        // Add the token to redis client
        // res.cookie('token',null,new Date(Date.now() - 1000)); // Clear the cookie by setting it to null and expiring it immediately
        
        res.clearCookie('token');

        //creates a date one second in the past. that is why we do -1000
        res.status(200).json({ message: "Logged out successfully" });

    }
    catch (err) {
        console.error('Error :', err);
        res.status(401).json({ error: err.message });
    }


}

const adminRegister = async (req, res) => {
    try {
         validate(req.body);
        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.role = "admin"; // Set the role to "admin" by default

        const user = await User.create({ firstName, lastName, emailId, password: hashedPassword, role: "admin" });

        const jwtSecret = process.env.JWT_SECRET_KEY;

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role:'admin' }, 
            jwtSecret, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error('Error :', err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: err.message });
    }
}

module.exports = { register, login, logout, adminRegister };