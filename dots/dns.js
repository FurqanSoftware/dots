import dns from "node:dns";

if (!process.env.NAMESERVERS) {
  throw new Error("NAMESERVERS environment variable is required (e.g. NAMESERVERS=8.8.8.8,8.8.4.4)");
}

const SERVERS = process.env.NAMESERVERS.split(",");

function createResolver() {
  const resolver = new dns.promises.Resolver();
  resolver.setServers(SERVERS);
  return resolver;
}

export async function lookup(type, addr) {
  const resolver = createResolver();

  switch (type) {
    case "a":
      return resolver.resolve4(addr, { ttl: true });

    case "aaaa":
      return resolver.resolve6(addr, { ttl: true });

    case "cname": {
      const records = await resolver.resolveCname(addr);
      return records.map((data) => ({ data }));
    }

    case "mx":
      return resolver.resolveMx(addr);

    case "naptr":
      return resolver.resolveNaptr(addr);

    case "ns": {
      const records = await resolver.resolveNs(addr);
      return records.map((data) => ({ data }));
    }

    case "ptr": {
      const records = await resolver.resolvePtr(addr);
      return records.map((data) => ({ data }));
    }

    case "soa": {
      const record = await resolver.resolveSoa(addr);
      return [{
        primary: record.nsname,
        admin: record.hostmaster,
        serial: record.serial,
        refresh: record.refresh,
        retry: record.retry,
        expiration: record.expire,
        minimum: record.minttl,
      }];
    }

    case "srv": {
      const records = await resolver.resolveSrv(addr);
      return records.map((r) => ({
        priority: r.priority,
        weight: r.weight,
        port: r.port,
        target: r.name,
      }));
    }

    case "txt": {
      const records = await resolver.resolveTxt(addr);
      return records.map((chunks) => ({ data: chunks.join("") }));
    }
  }
}
