const Redis = require("ioredis")

const redis = new Redis({
  host: 'redis-13044.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
  port: process.env.REDIS_PORT,
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_CLOUD_PASSWORD,
  db: 0, // Defaults to 0
})

module.exports = redis
