/* eslint-disable no-console */
const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const sslRedirect = require("heroku-ssl-redirect");
const app = express();

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "build")));

console.log("Starting Server: ", process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  console.log("In production - will redirect to https")
  app.use((req, res, next) => {
    console.log("Secure?", req.secure, req.headers["x-forwarded-proto"])
    if (!req.secure || req.headers["x-forwarded-proto"] == "http") {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      // request was via https, so do no special handling
      next();
    }
  });
}

app.use((_, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
