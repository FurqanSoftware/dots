import dns from "node:dns";

export async function lookup(addr) {
  const addresses = await dns.promises.reverse(addr);
  return addresses.map((address) => ({ address }));
}
