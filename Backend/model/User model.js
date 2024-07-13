const mongoose = require('mongoose');
const crypto = require('crypto');

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Simple email validation using regex
        return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  },
  username: String
});

// Pre-save hook to hash password before saving to the database
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Hash the password with the salt using SHA-256
  const hashedPassword = crypto.pbkdf2Sync(this.password, salt, 100000, 64, 'sha256').toString('hex');

  // Store the salt and hashed password
  this.password = `${salt}:${hashedPassword}`;
  next();
});

// Create User model
const User = mongoose.model('users', userSchema);

module.exports = User;
