require('dotenv').config();
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const cors        = require('cors');
const session     = require('express-session');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const config      = require('./config');
const usersRoutes = require('./routes/users');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useMongoClient: true }, (err) => {
  if (err) return console.log(err);
  console.log('Connected to database', config.db);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', usersRoutes);

app.get('*', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log('Listening of port 3000');
});
