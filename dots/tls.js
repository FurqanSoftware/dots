import tls from "tls";
import net from "net";

export async function lookup(addr) {
  return new Promise((resolve, reject) => {
    const options = {
      host: addr,
      port: 443,
      rejectUnauthorized: false,
      timeout: 5000,
    };

    if (!net.isIP(addr)) {
      options.servername = addr;
    }

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();

      if (!cert || !cert.subject) {
        resolve([]);
        return;
      }

      resolve([
        {
          subject: cert.subject.CN || "",
          issuer: cert.issuer.CN || "",
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          serialNumber: cert.serialNumber,
          fingerprint: cert.fingerprint,
        },
      ]);
    });

    socket.on("timeout", () => {
      socket.destroy();
      const err = new Error("tls: connection timed out");
      err.code = "TIMEOUT";
      reject(err);
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}
