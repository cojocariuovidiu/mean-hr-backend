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

module.exports = {
  index,
  show
};
