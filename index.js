require("dotenv").config();
const express = require("express");
const cors = require("cors");
const validator = require("validator");
const bodyParser = require("body-parser");
const app = express();
const { HashTable } = require("./hash");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const hashTable = new HashTable();
let key = 0;
app.post("/api/shorturl", function (req, res) {
  const Url = req.body.url;
  const removeUrl = Url.replace(/\/$/, "");
  if (validator.default.isURL(removeUrl)) {
    if (hashTable.searchFunction(removeUrl)) {
      key++;
    }

    hashTable.addPair(key, Url);

    const info = {
      original_url: Url,
      short_url: key,
    };
    res.status(200).json(info);
  } else {
    res.status(400).json({ error: "invalid url" });
  }
});
app.get("/api/shorturl/:id", function (req, res) {
  const id = req.params.id;
  const orginalUrl = hashTable.searchFunction(id);
  if (orginalUrl) {
    res.redirect(orginalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
