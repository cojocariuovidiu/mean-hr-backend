const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'hr', 'manager', 'staff'],
    default: 'staff'
  },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
