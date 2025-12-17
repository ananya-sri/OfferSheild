import axios from "axios";
import redis from "../config/redisClient.js";

export const verifyDomain = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Missing query 'q'" });
    }

    const redisKey = `whois:${query}`;

    // 1️⃣ Check Redis Cache
    const cached = await redis.get(redisKey);
    if (cached) {
      console.log("⚡ Serving WHOIS from Redis Cache");
      return res.json(JSON.parse(cached));
    }

    console.log("🌍 Fetching WHOIS from API...");

    // 2️⃣ API Call to whoisfreaks
    const URL = `https://api.whoisfreaks.com/v1.0/whois?apiKey=${process.env.WHOIS_API_KEY}&whois=live&domainName=${query}`;

    const { data } = await axios.get(URL);

    const result = {
      domain: data.domainName,
      registrar: data.registrarName,
      createdDate: data.createdDate,
      updatedDate: data.updatedDate,
      expiresDate: data.expiryDate,
      isExpired: data.isExpired,
      status: data.domainStatus,
      isSuspicious: !data.registrarName || data.isExpired === true
    };

    // 3️⃣ Save to Redis (24 hours)
    await redis.set(redisKey, JSON.stringify(result), "EX", 86400);

    return res.json(result);

  } catch (err) {
    console.error("WHOIS API error:", err.message);
    return res.status(500).json({
      error: "WHOIS lookup failed",
      details: err.message
    });
  }
};
