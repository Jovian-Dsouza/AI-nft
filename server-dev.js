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

// app.use(process.env.REACT_APP_API_PATH, createProxyMiddleware({target: process.env.REACT_APP_API_URL, changeOrigin: true}));

app.post("/v1/predictions", function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: 1, status: "starting...", error: null }));
});

app.get("/v1/predictions/:id", function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      id: 1, 
      status: 'succeded', 
      error: null, 
      output: ['https://replicate.delivery/pbxt/f4nlztv3uz1iFC4AEf2wBYQGTezdVeysvtZUtwfsvZOJDN6AC/out-0.png'],
    }));
});

app.post("/", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000')
});
