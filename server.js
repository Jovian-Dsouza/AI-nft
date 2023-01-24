const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { IPFS } = require('./src/scripts/ipfs');

const app = express();
app.use(bodyParser.json());
require('dotenv').config("")

const ipfs = new IPFS(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
ipfs.testAuthentication();

app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(process.env.REACT_APP_API_PATH, createProxyMiddleware({target: process.env.REACT_APP_API_URL, changeOrigin: true}));

app.post("/addIPFS", async function(req, res){
    const result = await ipfs.addToIPFS(req.body.url, req.body.name);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      result: result,
    }));
});

app.post("/", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000')
});
