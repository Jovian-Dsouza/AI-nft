const express = require("express");
const path = require("path");
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
require('dotenv').config("")


app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(process.env.REACT_APP_API_PATH, createProxyMiddleware({target: process.env.REACT_APP_API_URL, changeOrigin: true}));


app.post("/", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000')
});
