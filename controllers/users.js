const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

const register = (req, res) => {
  let username, email, password;

  if (req.body.username) username = req.body.username;
  if (req.body.email) email = req.body.email;
  if (req.body.password) password = req.body.password;

  let newUser = new User({ username, email, password });

  newUser.save((err) => {
    if (err) {
      if (err.code === 11000) return res.status(400).json({
        message: 'User already exists.'
      });

      if (err.errors.username) return res.status(400).json({
        message: err.errors.username.message
      });

      if (err.errors.email) return res.status(400).json({
        message: err.errors.email.message
      });

      if (err.errors.password) return res.status(400).json({
        message: err.errors.password.message
      });
    }

    res.status(201).json({ message: 'User registered successfully.'} );
  });
};

const authenticate = (req, res) => {
  if (!req.body.username) return res.status(400).json({
    message: 'Username is required.'
  });

  if (!req.body.password) return res.status(400).json({
    message: 'Password is required.'
  });

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return res.status(500).json({
      message: 'Oops! Something went wrong.'
    });

    if (!user) return res.status(400).json({
      message: 'User does not exists.'
    });

    if (req.body.password.length < 8) res.status(400).json({
      message: 'Password must be at least (8) characters.'
    });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return res.status(500).jsone({
        message: 'Oops! Something went wrong.'
      });

      if (!isMatch) return res.status(401).json({
        message: 'Invalid username and/or password.'
      });

      const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }, config.secret, { expiresIn: '7d' });

      res.status(200).json({
        token: 'JWT ' + token,
        message: 'User authenticated successfully.'
      });
    });
  });
};

const index = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).json({
      message: 'Oops! Something went wrong.'
    });

    res.status(200).json(users);
  });
};

const show = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(400).json({
      message: 'Invalid user ID.'
    });

    if (!user) return res.status(404).json({
      message: 'User not found.'
    });

    res.status(200).json(user);
  });
};

const update = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(400).json({
      message: 'Invalid user ID.'
    });

    if (!user) return res.status(404).json({
      message: 'User not found.'
    });

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.role) user.role = req.body.role;
    if (req.body.avatar) user.avatar = req.body.avatar;

    user.save((err) => {
      if (err) {
        if (err.errors.username) return res.status(400).json({
          message: err.errors.username.message
        });

        if (err.errors.email) return res.status(400).json({
          message: err.errors.email.message
        });

        if (err.errors.password) return res.status(400).json({
          message: err.errors.password.message
        });
      }

      res.status(200).json({ message: 'User updated successfully.'} );
    });
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.replace(/JWT /, '');

  if (!token) return res.status(403).json({
    message: 'No token provided'
  });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).json({
      message: 'Invalid token!'
    });
    req.decoded = decoded;
    next();
  });
};

const changePassword = (req, res) => {
  User.findById(req.decoded.id, (err, user) => {
    if (err) return res.status(500).json({
      message: 'Oops! Something went wrong.'
    });

    if (!user) return res.status(404).json({
      message: 'User not found.'
    });

    user.comparePassword(req.body.oldPassword, (err, isMatch) => {
      if (err) return res.status(500).json({
        message: 'Oops! Something went wrong.'
      });

      if (!isMatch) return res.status(401).json({
        message: 'Invalid password.'
      });

      user.password = req.body.newPassword;
      user.save((err) => {
        if (err) return res.status(500).json({
          message: 'Oops! Something went wrong.'
        });

        res.status(200).json({ message: 'Password updated successfully.' });
      });
    });
  });
};

module.exports = {
  register,
  authenticate,
  index,
  show,
  update,
  verifyToken,
  changePassword
};
