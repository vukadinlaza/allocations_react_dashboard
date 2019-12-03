/* eslint-disable no-console */
const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const sslRedirect = require("heroku-ssl-redirect");
const app = express();

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "build")));
app.use(sslRedirect());

app.use((_, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
