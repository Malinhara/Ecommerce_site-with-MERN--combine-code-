const User = require('../model/User model'); // Import User model
const crypto = require('crypto');
const session = require('express-session');
const escapeHtml = require('escape-html');


const sessionMiddleware = session({
  secret: 'strong-secret-key',
  genid: function () {
    return crypto.randomBytes(16).toString('hex');
  },
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  },
});

exports.loginUser = async (req, res) => {
  try {

    // Invoke the session middleware
    sessionMiddleware(req, res, async () => {
      const { email, password } = req.body;
      
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Split the stored password into salt and hashed password
      const [salt, storedHashedPassword] = user.password.split(':');

      // Hash the provided password with the stored salt
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');

      if (hashedPassword === storedHashedPassword) {
        console.log('Password matched successfully');

        // Return login success message along with session ID
        return res.status(200).json({ message: 'Login successful', sessionID: req.sessionID });

      } else {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid password' });
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




  exports.registerUser = async (req, res) => {

    try {
      sessionMiddleware(req, res, async () => {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      const sanitizedUsername = escapeHtml(req.body.username).replace(/<\/?[^>]+(>|$)/g, "");
  
      const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        username: sanitizedUsername
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });

    })
    
    } catch (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };


