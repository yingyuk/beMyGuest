const express = require('express');
const app = express();
const port = 3000;

const poem = require('./poem');
var login = require('./music_163/login.js');

login();
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`App listen at http://127.0.0.1:${port}`);
});
