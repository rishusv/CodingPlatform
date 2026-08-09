const User = require('../models/users');
const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req,res) =>{
    try{
        validate(req.body);
        const {firstName,emailId,password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, emailId, password: hashedPassword });

        const token = jwt.sign({_id: user._id, emailId: user.emailId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error('Error :', err);
        res.status(400).json({ error: err.message });
    }
}

