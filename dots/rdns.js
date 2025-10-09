import dns from "native-dns";

export async function lookup(addr) {
  return new Promise((resolve, reject) => {
    dns.reverse(addr, (err, addresses) => {
      if (err) {
        reject(err);
        return;
      }

      const results = addresses.map((address) => ({ address }));
      resolve(results);
    });
  });
}
