// lib/redis.ts
import { Redis } from 'redis';

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  console.warn('Redis configuration not found. Session storage will use database.');
}

export default redis;