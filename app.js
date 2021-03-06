if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
require('dotenv').config();

const express     = require('express');
const app         = express();
const morgan      = require('morgan');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const session     = require('express-session');
const mongoose    = require('./config/mongoose');
const usersRoutes = require('./routes/users');
const path        = require('path');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uploads/images/')));

app.use('/api', usersRoutes);

app.get('*', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, (err) => {
  if (err) return console.log(err);
  if (process.env.NODE_ENV === 'development') {
    console.log('Listening of port 3000');
  }
});

module.exports = app;
