import { createClient } from 'redis';
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisClient = createClient({
  // url: process.env.REDIS_URL || 'redis://redis:6379', // 
  // Use Docker service name
  socket: {
    host: redisHost,
    port: redisPort
  }
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect();


export default redisClient;

