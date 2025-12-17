import dns from "dns/promises";
import axios from "axios";
import whois from "whois-json";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 }); // cache 24 hours

// -----------------------------------------
// 1. Extract domain from email or URL
// -----------------------------------------
export function extractDomain(input) {
  if (!input) return null;

  // Is it email?
  const emailMatch = input.match(/@(.+)$/);
  if (emailMatch) return emailMatch[1].toLowerCase();

  // Add https:// if missing
  try {
    const url = input.startsWith("http") ? input : "https://" + input;
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace("www.", "");
  } catch (err) {
    // If user directly enters "flipkart.com"
    if (input.includes(".")) return input.toLowerCase();
    return null;
  }
}

// -----------------------------------------
// 2. DNS Check (MX + A records)
// -----------------------------------------
export async function dnsCheck(domain) {
  const key = "dns_" + domain;
  if (cache.get(key)) return cache.get(key);

  const result = { mx: false, a: false };

  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) result.mx = true;
  } catch {}

  try {
    const a = await dns.resolve(domain);
    if (a.length > 0) result.a = true;
  } catch {}

  cache.set(key, result);
  return result;
}

// -----------------------------------------
// 3. Website Check
// -----------------------------------------
export async function websiteCheck(domain) {
  const key = "web_" + domain;
  if (cache.get(key)) return cache.get(key);

  const result = { reachable: false, status: null };

  try {
    const res = await axios.get("https://" + domain, { timeout: 5000 });
    result.reachable = true;
    result.status = res.status;
  } catch (err) {
    result.reachable = false;
  }

  cache.set(key, result);
  return result;
}

// -----------------------------------------
// 4. WHOIS Check (Domain Age)
// -----------------------------------------
export async function getDomainAge(domain) {
  const key = "whois_" + domain;
  if (cache.get(key)) return cache.get(key);

  try {
    const data = await whois(domain);
    const creation = new Date(data.creationDate);
    const ageDays = Math.floor((Date.now() - creation.getTime()) / (1000 * 60 * 60 * 24));

    cache.set(key, ageDays);
    return ageDays;
  } catch {
    return null;
  }
}

// -----------------------------------------
// 5. MAIN FUNCTION: Calculate Trust Score
// -----------------------------------------
export async function verifyCompany(input) {
  const domain = extractDomain(input);
  if (!domain) return { error: "Invalid input" };

  const dns = await dnsCheck(domain);
  const website = await websiteCheck(domain);
  const age = await getDomainAge(domain);

  let score = 50; // start from neutral

  if (dns.mx) score += 20; else score -= 20;
  if (dns.a) score += 10; else score -= 10;
  if (website.reachable) score += 10; else score -= 10;
  if (age !== null && age > 365) score += 20;
  if (age !== null && age < 60) score -= 25;

  score = Math.max(0, Math.min(100, score));

  return {
    domain,
    trust_score: score,
    dns_ok: dns.mx && dns.a,
    mx_records: dns.mx,
    a_records: dns.a,
    website_ok: website.reachable,
    domain_age_days: age,
    verdict:
      score > 80 ? "Real Company" :
      score > 60 ? "Likely Real" :
      score > 40 ? "Suspicious" : "High Chance Fake",
  };
}
