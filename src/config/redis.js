const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'emblematic-satisfied-primary-60384.db.redis.io',
        port: 13564
    }
});

module.exports = redisClient;

