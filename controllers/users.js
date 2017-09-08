const User = require('../models/user');

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

const create = (req, res) => {
  let username, email, password, role, avatar;

  if (req.body.username) username = req.body.username;
  if (req.body.email) email = req.body.email;
  if (req.body.password) password = req.body.password;
  if (req.body.role) role = req.body.role;
  if (req.body.avatar) avatar = req.body.avatar;

  let newUser = new User({ username, email, password, role, avatar });

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

    res.status(201).json({ message: 'User created successfully.'} );
  });
};

module.exports = {
  index,
  show,
  create
};
