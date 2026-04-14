export const QUERIES = {
  a: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  aaaa: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  cname: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  mx: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "priority" },
      { name: "exchange", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  naptr: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "order" },
      { name: "preference" },
      { name: "flags" },
      { name: "service" },
      { name: "regexp" },
      { name: "ttl", type: "time" },
    ],
  },
  ns: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  ptr: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data" },
      { name: "ttl", type: "time" },
    ],
  },
  soa: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "primary" },
      { name: "admin" },
      { name: "serial" },
      { name: "refresh" },
      { name: "retry" },
      { name: "expiration" },
      { name: "minimum" },
      { name: "ttl", type: "time" },
    ],
  },
  srv: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "priority" },
      { name: "weight" },
      { name: "port" },
      { name: "target" },
      { name: "ttl", type: "time" },
    ],
  },
  txt: {
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data" },
      { name: "ttl", type: "time" },
    ],
  },
  tls: {
    types: ["DOMAIN", "IP"],
    output: "kvtable",
    fields: [
      { name: "subject", label: "Subject" },
      { name: "issuer", label: "Issuer" },
      { name: "validFrom", label: "Valid From" },
      { name: "validTo", label: "Valid To" },
      { name: "serialNumber", label: "Serial Number" },
      { name: "fingerprint", label: "Fingerprint" },
    ],
  },
  http: {
    types: ["DOMAIN", "IP"],
    output: "kvpre",
    fields: [
      { name: "url", label: "URL" },
      { name: "status", label: "Status" },
      { name: "server", label: "Server" },
      { name: "tls", label: "TLS" },
    ],
    preField: "rawHeaders",
  },
  rdns: {
    types: ["IP"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
    ],
  },
  whois: {
    types: ["DOMAIN", "IP"],
    output: "pre",
  },
  geo: {
    types: ["DOMAIN", "IP"],
    output: "map",
  },
};

export const QUERY_TABS = [
  { key: "a", label: "A" },
  { key: "aaaa", label: "AAAA" },
  { key: "cname", label: "CNAME" },
  { key: "mx", label: "MX" },
  { key: "naptr", label: "NAPTR" },
  { key: "ns", label: "NS" },
  { key: "ptr", label: "PTR" },
  { key: "soa", label: "SOA" },
  { key: "srv", label: "SRV" },
  { key: "txt", label: "TXT" },
  { key: "rdns", label: "rDNS" },
  { key: "tls", label: "TLS" },
  { key: "http", label: "HTTP" },
  { key: "whois", label: "WHOIS" },
  { key: "geo", label: "Geo" },
];
