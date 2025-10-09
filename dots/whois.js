import whois from "whois";

export async function lookup(addr) {
  return new Promise((resolve, reject) => {
    whois.lookup(addr, { follow: 1, timeout: 5000 }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve([{ data: data }]);
    });
  });
}
