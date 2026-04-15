import fs from "fs";
import net from "net";
import path from "path";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { query as dotsQuery } from "./dots/index.js";

const VALID_TYPES = new Set([
  "a", "aaaa", "cname", "mx", "naptr", "ns", "ptr", "soa", "srv", "txt",
  "rdns", "tls", "http", "whois", "geo",
]);

const DOMAIN_RE = /^(?:[_a-zA-Z0-9](?:[_a-zA-Z0-9-]{0,61}[_a-zA-Z0-9])?\.)*[a-zA-Z]{2,}$/;

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "dist")));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/", queryLimiter, async (req, res, next) => {
  const { type, addr } = req.body;

  if (typeof type !== "string" || !VALID_TYPES.has(type)) {
    return res.sendStatus(400);
  }

  if (typeof addr !== "string" || addr.length > 253 || (!net.isIP(addr) && !DOMAIN_RE.test(addr))) {
    return res.sendStatus(400);
  }

  try {
    const records = await dotsQuery(type, addr);
    res.json({ records });
  } catch (err) {
    handleError(err, res, next);
  }
});

const distIndexPath = path.join(process.cwd(), "dist", "index.html");
let indexHtml = null;
try {
  indexHtml = fs.readFileSync(distIndexPath, "utf-8");
  indexHtml = indexHtml.replace("__MAPBOX_TOKEN__", process.env.MAPBOX_TOKEN || "");
} catch {}

app.get("*any", (req, res) => {
  if (req.path === "/" && req.query.addr) {
    res.redirect(`/${req.query.addr}`);
    return;
  }

  if (!indexHtml) {
    return res.status(503).send("Run 'npm run build' first, or use 'npm run dev' for development.");
  }

  res.type("html").send(indexHtml);
});

const handleError = (err, res, next) => {
  switch (err.code) {
    case "ENOTFOUND":
    case "ENODATA":
    case "TIMEOUT":
      res.json({ records: [] });
      break;

    case "BADQUERY":
      res.sendStatus(400);
      break;

    default:
      next(err);
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
