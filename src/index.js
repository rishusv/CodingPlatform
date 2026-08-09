const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db.js');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);

const intializeConnection = async () => {
    try {
        await Promise.all([main(),redisClient.connect()]); // Connect to both MongoDB and Redis
        console.log('Connected to MongoDB and Redis successfully');
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
};

intializeConnection();

