import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379"
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

await redis.connect();

export default redis;
