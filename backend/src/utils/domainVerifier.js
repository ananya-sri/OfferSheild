// backend/src/utils/domainVerifier.js
import dns from "dns/promises";
import axios from "axios";
import whois from "whois-json";
import { redisClient } from "./redisClient.js"; // redis client

// TTL secs for cached items
const TTL_SECONDS = 60 * 60 * 24; // 24 hours

// Helper: extract domain from email or url
export function extractDomain(input) {
  if (!input) return null;
  input = input.trim();
  const emailMatch = input.match(/@([^>\s,;]+)/);
  if (emailMatch) return emailMatch[1].toLowerCase().replace(/^www\./, "");
  try {
    const url = input.startsWith("http") ? input : "https://" + input;
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch (e) {
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(input)) return input.toLowerCase();
    return null;
  }
}

// Helper: get cached JSON by key
async function getCache(key) {
  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Redis GET error:", err?.message || err);
    return null;
  }
}

// Helper: set cache
async function setCache(key, value, ttl = TTL_SECONDS) {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.warn("Redis SET error:", err?.message || err);
  }
}

// DNS checks
export async function checkDns(domain) {
  const key = `dns:${domain}`;
  const cached = await getCache(key);
  if (cached) return cached;

  const result = { a: false, mx: false, a_records: [], mx_records: [] };
  try {
    const a = await dns.resolve(domain, "A");
    if (Array.isArray(a) && a.length) {
      result.a = true;
      result.a_records = a;
    }
  } catch (e) { /* no A */ }
  try {
    const mx = await dns.resolveMx(domain);
    if (Array.isArray(mx) && mx.length) {
      result.mx = true;
      result.mx_records = mx;
    }
  } catch (e) { /* no MX */ }

  await setCache(key, result);
  return result;
}

// Website fetch & heuristics
export async function fetchWebsiteInfo(domain) {
  const key = `web:${domain}`;
  const cached = await getCache(key);
  if (cached) return cached;

  const result = {
    url: null,
    status: null,
    title: null,
    has_contact: false,
    has_careers: false,
    server: null,
  };

  const tryFetch = async (url) => {
    try {
      const r = await axios.get(url, {
        timeout: 7000,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ScamChecker/1.0)" },
        maxRedirects: 3
      });
      return r;
    } catch (err) {
      return null;
    }
  };

  let r = await tryFetch(`https://${domain}`);
  if (!r) r = await tryFetch(`http://${domain}`);

  if (!r) {
    await setCache(key, result);
    return result;
  }

  result.url = r.request?.res?.responseUrl || (r.config && r.config.url) || `https://${domain}`;
  result.status = r.status;
  result.server = r.headers?.server || null;

  const html = (typeof r.data === "string") ? r.data : JSON.stringify(r.data || "");
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const lower = html.toLowerCase();
  result.has_contact = lower.includes("contact") || lower.includes("contact us") || lower.includes("contact-us");
  result.has_careers = lower.includes("careers") || lower.includes("jobs") || lower.includes("join us");

  await setCache(key, result);
  return result;
}

// WHOIS age in days (uses whois-json)
export async function getDomainAgeDays(domain) {
  const key = `whois:${domain}`;
  const cached = await getCache(key);
  if (cached !== null) return cached; // could be null stored too

  try {
    const info = await whois(domain);
    // find possible creation fields
    const possibles = [info.creationDate, info.created, info["Creation Date"], info.createdDate, info.registered].filter(Boolean);
    let created = null;
    for (const d of possibles) {
      const dt = new Date(d);
      if (!isNaN(dt.getTime())) { created = dt; break; }
    }
    if (!created) {
      await setCache(key, null); // store null to avoid repeat attempts for some time
      return null;
    }
    const ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    await setCache(key, ageDays);
    return ageDays;
  } catch (err) {
    await setCache(key, null);
    return null;
  }
}

// Compute trust score (same as earlier but included here)
export function computeTrustScore({ dnsInfo, webInfo, domainAgeDays, googleResults }) {
  let score = 50;
  if (dnsInfo?.a) score += 10;
  if (dnsInfo?.mx) score += 15;
  if (webInfo?.status && webInfo.status >= 200 && webInfo.status < 400) score += 15;
  if (webInfo?.title && webInfo.title.length > 4) score += 5;
  if (webInfo?.has_contact) score += 5;
  if (webInfo?.has_careers) score += 5;
  if (domainAgeDays && domainAgeDays > 365) score += 10;
  if (domainAgeDays && domainAgeDays > 3650) score += 5;
  if (googleResults && googleResults.length > 0) {
    const foundLinkedIn = googleResults.some(i => /linkedin\.com\/company|linkedin\.com\/school/.test(i.link || ""));
    if (foundLinkedIn) score += 10;
    const hasOfficial = googleResults.some(i => /official|company|careers|about/.test((i.snippet||"").toLowerCase()));
    if (hasOfficial) score += 5;
  }
  if (score > 100) score = 100;
  if (score < 0) score = 0;
  return Math.round(score);
}

// main helper to get full verification object (caches entire object too)
export async function verifyDomain(input) {
  const domain = extractDomain(input);
  if (!domain) return { error: "Invalid input" };

  // top-level cache for full verify
  const cacheKey = `verify:${domain}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const dnsInfo = await checkDns(domain);
  const webInfo = await fetchWebsiteInfo(domain);
  const domainAgeDays = await getDomainAgeDays(domain);

  // placeholder: googleResults null for now (add GCS later)
  const googleResults = null;

  const trust_score = computeTrustScore({ dnsInfo, webInfo, domainAgeDays, googleResults });

  let verdict = "unknown";
  if (trust_score > 80) verdict = "likely_real";
  else if (trust_score > 60) verdict = "probably_real";
  else if (trust_score > 40) verdict = "suspicious";
  else verdict = "likely_fake";

  const result = {
    domain,
    dns: dnsInfo,
    website: webInfo,
    domain_age_days: domainAgeDays,
    trust_score,
    verdict,
    explanation: `Score ${trust_score} computed from DNS, website and WHOIS signals.`
  };

  await setCache(cacheKey, result);
  return result;
}
