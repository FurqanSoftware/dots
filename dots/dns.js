import sample from "lodash/sample.js";
import dns from "native-dns";

const SERVERS = process.env.NAMESERVERS.split(",");

export async function lookup(type, addr) {
  return new Promise((resolve, reject) => {
    const req = new dns.Request({
      question: new dns.Question({
        type,
        name: addr,
      }),
      server: sample(SERVERS),
      timeout: 5000,
    });

    let timedout = false;
    let errored = false;

    req.on("timeout", () => {
      timedout = true;
      req.cancel();
      reject(dns.TIMEOUT);
    });

    req.on("end", () => {
      if (errored || timedout) return;
      resolve(records);
    });

    const records = [];
    req.on("message", (err, message) => {
      if (err) {
        errored = true;
        req.cancel();
        reject(err);
        return;
      }

      for (const record of message.answer) {
        delete record.name; // using dot notation for better readability
        delete record.type;
        delete record.class;
        records.push(record);
      }
    });

    req.send();
  });
}
