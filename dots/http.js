import https from "https";
import http from "http";

export async function lookup(addr) {
  try {
    return await request("https", addr);
  } catch {
    return await request("http", addr);
  }
}

function request(protocol, addr) {
  const mod = protocol === "https" ? https : http;
  const url = protocol + "://" + addr + "/";

  return new Promise((resolve, reject) => {
    const req = mod.request(
      url,
      {
        method: "HEAD",
        timeout: 5000,
        rejectUnauthorized: false,
      },
      (res) => {
        res.resume();

        const tls =
          res.socket.encrypted && res.socket.getPeerCertificate
            ? res.socket.getPeerCertificate()
            : null;

        const rawHeaders = formatRawHeaders(res);

        resolve([
          {
            url: url,
            status: res.statusCode + " " + (res.statusMessage || ""),
            server: res.headers["server"] || "",
            tls: tls ? protocol.toUpperCase() + " (" + (res.socket.getProtocol ? res.socket.getProtocol() : "") + ")" : "No",
            rawHeaders: rawHeaders,
          },
        ]);
      },
    );

    req.on("timeout", () => {
      req.destroy();
      const err = new Error("http: connection timed out");
      err.code = "TIMEOUT";
      reject(err);
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

function formatRawHeaders(res) {
  let result = "HTTP/" + res.httpVersion + " " + res.statusCode + " " + (res.statusMessage || "") + "\n";
  const headers = res.rawHeaders;
  for (let i = 0; i < headers.length; i += 2) {
    result += headers[i] + ": " + headers[i + 1] + "\n";
  }
  return result;
}
