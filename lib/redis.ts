// lib/redis.ts
import { createClient } from "redis";

let redis = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = createClient({
    url: process.env.UPSTASH_REDIS_REST_URL,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  console.warn(
    "Redis configuration not found. Session storage will use database."
  );
}

export default redis;
