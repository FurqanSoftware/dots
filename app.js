import pick from "lodash/pick.js";
import path from "path";
import express from "express";
import morgan from "morgan";
import stylus from "stylus";
import { query as dotsQuery } from "./dots/index.js";

const app = express();

app.set("view engine", "pug");
app.disable("x-powered-by");

Object.assign(app.locals, pick(process.env, ["MAPBOX_TOKEN"]));

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

app.get("/*any", (req, res) => {
  if (req.path === "/" && req.query.addr) {
    res.redirect(`/${req.query.addr}`);
    return;
  }

  res.render("index");
});

app.post("/", async (req, res, next) => {
  if (!req.xhr) {
    return res.sendStatus(403);
  }

  const { type, addr } = req.body;

  try {
    const records = await dotsQuery(type, addr); // Assuming 'dots' was updated to return a Promise
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
