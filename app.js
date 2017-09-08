const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');
const morgan     = require('morgan');
const app        = express();

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log('Listening of port 3000');
});
