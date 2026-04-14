const IPV4_RE =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;

const IPV6_RE =
  /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6}|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))$/;

const DOMAIN_RE = /^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export function isIP(addr) {
  return IPV4_RE.test(addr) || IPV6_RE.test(addr);
}

export function isDomain(addr) {
  return DOMAIN_RE.test(addr);
}

export function isValidAddr(addr) {
  return isIP(addr) || isDomain(addr);
}

export function getAddrKind(addr) {
  if (isIP(addr)) return "IP";
  if (isDomain(addr)) return "DOMAIN";
  return null;
}
