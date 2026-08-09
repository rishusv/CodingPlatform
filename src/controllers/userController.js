const User = require('../models/users');
const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req,res) =>{
    try{
        validate(req.body);
        const { firstName, lastName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, lastName, emailId, password: hashedPassword });

        const token = jwt.sign({_id: user._id, emailId: user.emailId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
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

const login = async (req,res) =>{
    try{
        const {emailId,password} = req.body;

        const user = await User.findOne({ emailId });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({_id: user._id, emailId: user.emailId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.error('Error :', err);
        res.status(400).json({ error: err.message });
    }
}

const logout = (req,res) =>{

    try{
        //validate the token - we can use middleware
        //token add in redis blocklist
        // clear the cookie

    }
    catch(err){
        console.error('Error :', err);
        res.status(400).json({ error: err.message });
    }
    
    
}

module.exports = { register, login, logout };