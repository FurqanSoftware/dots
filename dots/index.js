import { lookup as dnsLookup } from "./dns.js";
import { locate as geoLocate } from "./geo.js";
import { lookup as rdnsLookup } from "./rdns.js";
import { lookup as whoisLookup } from "./whois.js";

export async function query(kind, addr) {
  try {
    switch (kind) {
      case "a":
      case "aaaa":
      case "cname":
      case "mx":
      case "naptr":
      case "ns":
      case "ptr":
      case "soa":
      case "srv":
      case "txt":
        return await dnsLookup(kind, addr);

      case "rdns":
        return await rdnsLookup(addr);

      case "geo":
        return await geoLocate(addr);

      case "whois":
        return await whoisLookup(addr);

      default:
        throw newError("query: invalid kind", "BADQUERY");
    }
  } catch (err) {
    throw err; // Rethrow the error to handle it where the function is called
  }
}

const newError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};
