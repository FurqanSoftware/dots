import net from "net";
import path from "path";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import stylus from "stylus";
import { query as dotsQuery } from "./dots/index.js";

const VALID_TYPES = new Set([
  "a", "aaaa", "cname", "mx", "naptr", "ns", "ptr", "soa", "srv", "txt",
  "rdns", "tls", "http", "whois", "geo",
]);

const DOMAIN_RE = /^(?:[_a-zA-Z0-9](?:[_a-zA-Z0-9-]{0,61}[_a-zA-Z0-9])?\.)*[a-zA-Z]{2,}$/;

const app = express();

app.set("view engine", "pug");
app.disable("x-powered-by");

app.locals.MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

app.use(morgan("dev")); // Sets up logging middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  stylus.middleware({
    src: path.join(process.cwd(), "public"), // Changed __dirname for better compatibility
    compress: true,
  }),
);

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

app.get("*any", (req, res) => {
  if (req.path === "/" && req.query.addr) {
    res.redirect(`/${req.query.addr}`);
    return;
  }

  res.render("index");
});

const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/", queryLimiter, async (req, res, next) => {
  if (!req.xhr) {
    return res.sendStatus(403);
  }

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

// Error handler function
const handleError = (err, res, next) => {
  switch (err.code) {
    case "ENOTFOUND":
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
