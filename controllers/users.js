const User = require('../models/user');

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

module.exports = {
  register,
  index,
  show,
  update
};
