const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db.js');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');

app.use(express.json());
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

// main()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server listening on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Database connection failed:', err.message);
//     app.listen(PORT, () => {
//       console.log(`Server listening on port ${PORT} without DB connection`);
//     });
//   });
