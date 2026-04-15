export const QUERIES = {
  a: {
    label: "A",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  aaaa: {
    label: "AAAA",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  cname: {
    label: "CNAME",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  mx: {
    label: "MX",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "priority" },
      { name: "exchange", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  naptr: {
    label: "NAPTR",
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
    label: "NS",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data", type: "addr" },
      { name: "ttl", type: "time" },
    ],
  },
  ptr: {
    label: "PTR",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data" },
      { name: "ttl", type: "time" },
    ],
  },
  soa: {
    label: "SOA",
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
    label: "SRV",
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
    label: "TXT",
    types: ["DOMAIN"],
    output: "table",
    fields: [
      { name: "data" },
      { name: "ttl", type: "time" },
    ],
  },
  rdns: {
    label: "rDNS",
    types: ["IP"],
    output: "table",
    fields: [
      { name: "address", type: "addr" },
    ],
  },
  tls: {
    label: "TLS",
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
    label: "HTTP",
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
  whois: {
    label: "WHOIS",
    types: ["DOMAIN", "IP"],
    output: "pre",
  },
  geo: {
    label: "Geo",
    types: ["DOMAIN", "IP"],
    output: "map",
  },
};

export const DNS_QUERIES = [
  "a", "aaaa", "cname", "mx", "naptr", "ns", "ptr", "soa", "srv", "txt",
];

export const RDNS_QUERIES = ["rdns"];

export const TABS = [
  { key: "dns", label: "DNS", types: ["DOMAIN", "IP"] },
  { key: "tls", label: "TLS", types: ["DOMAIN", "IP"] },
  { key: "http", label: "HTTP", types: ["DOMAIN", "IP"] },
  { key: "whois", label: "WHOIS", types: ["DOMAIN", "IP"] },
  { key: "geo", label: "Geo", types: ["DOMAIN", "IP"] },
];
