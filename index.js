const express = require('express');
const path = require('path');

var app = express();

const port = 8080;

const staticPath = path.join(__dirname, './public');

app.use(express.static(staticPath));


app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});

app.get('/', function(req, res) {
  res.render('index.html');
});

module.exports = {
  app: app
};
