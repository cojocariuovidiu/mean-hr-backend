const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true,
    minlength: [2, 'Username must be at least (2) characters.'],
    maxlength: [50, 'Username must be at most (50) characters.']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required.'],
    unique: true,
    validate: {
      validator: (email) => {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      }, message: 'Email is not a valid email address.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least (8) characters.']
  },
  role: {
    type: String,
    required: [true, 'Role is required.'],
    enum: ['admin', 'hr', 'manager', 'staff'],
    default: 'staff'
  },
  avatar: {
    type: String
  }
});

UserSchema.index({ username: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
