const User = require('../model/User model'); // Import User model
const crypto = require('crypto');
const session = require('express-session');
const escapeHtml = require('escape-html');
const Product = require('../model/product model');

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
    sessionMiddleware(req, res, async () => {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(409).json({ error: 'Invalid email or password' });
      }

      // Split the stored password into salt and hashed password
      const [salt, storedHashedPassword] = user.password.split(':');

      // Hash the provided password with the stored salt
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');

      if (hashedPassword === storedHashedPassword) {
        console.log('Password matched successfully');
        console.log('Session ID:', req.sessionID);

        // If the user's email matches the specified email, redirect to the admin panel
        if (email === 'poorna123@gmail.com') {
          return  res.status(201).json({ message: 'User Login successfully', redirectTo: '/Adminpannel' });
        }

        // Return login success message along with session ID
        return res.status(201).json({ message: 'Login successful', sessionID: req.sessionID,redirectTo: '/home' });
      } else {
        console.log('Password mismatch');
        return res.status(409).json({ error: 'Invalid password' });
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
        return res.status(409).json({ error: 'Email already exists' });
      }

      const sanitizedUsername = escapeHtml(req.body.username).replace(/<\/?[^>]+(>|$)/g, "");

      const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        username: sanitizedUsername
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Clear session data
    req.session = null;
    console.log('Session data cleared successfully');
    console.log(req.session)
    // Return a response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.userBuy = async (req, res) => {
  try {
    sessionMiddleware(req, res, async () => {
      const { email, productIds } = req.body;

    const sessionID = req.headers['session-id'];
    // Check if session ID exists
    if (!sessionID) {
      return res.status(409).json({ error: 'Unauthorized: Session ID is missing and Please Relogin' });
    }


      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(409).json({ error: 'User does not exist' });
      }

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(409).json({ error: 'Invalid product IDs' });
      }

      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== productIds.length) {
        return res.status(409).json({ error: 'Some products not found' });
      }

      existingUser.products = products.map(product => product._id);

      await existingUser.save();

      res.status(200).json({ message: 'Products added to user successfully', user: existingUser });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.findproduct = async (req, res) => {
  try {
    const { email } = req.body; // Assuming you send the email in the request body

    // Step 1: Find the user based on the provided email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(409).json({ error: 'User not found' });
    }

    // Step 2: Extract product IDs from the user's products array
    const productIds = user.products.map(product => product._id);

    // Step 3: Fetch product details using the product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Step 4: Return the user data along with the associated products in the response
    return res.status(200).json({products });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
