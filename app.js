const _ = require("underscore");
const path = require("path");
const dots = require("./dots");
const express = require("express");
const stylus = require("stylus");

const app = express();

app.set("view engine", "pug");
app.disable("x-powered-by");

_.extend(app.locals, _.pick(process.env, ["GOSQUARED_KEY"]));

app.use(require("morgan")());

app.use(express.json());
app.use(express.urlencoded());

app.use(
  stylus.middleware({
    src: path.join(__dirname, "public"),
    compress: true,
  }),
);

app.use(express.static(path.join(__dirname, "public")));

app.route("/*any").get((req, res) => {
  if (req.path == "/" && req.query.addr) {
    res.redirect(`/${req.query.addr}`);
    return;
  }

  res.render("index");
});

app.route("/").post((req, res, next) => {
  if (!req.xhr) {
    res.send(403);
    return;
  }

  const { type, addr } = req.body;
  dots(type, addr, (err, records) => {
    if (!err) {
      res.json({ records });
      return;
    }

    switch (err.code) {
      case "ENOTFOUND":
      case "TIMEOUT":
        res.json({ records: [] });
        break;

      case "BADQUERY":
        res.json(400);
        break;

      default:
        next(err);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
