const User = require('../model/User model'); // Import User model
const crypto = require('crypto');
const Product = require('../model/product model');
const nodemailer = require('nodemailer');
const escapeHTML = require('escape-html');
const logger = require('../LogFile/Logger');
require('dotenv').config();

// Function to generate a random code
const generateRandomCode = () => {
  return Math.random().toString(36).substr(2, 6);
};

// Login function
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.log(req, 'Login attempt', null, email);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.log(req, 'Invalid email', null, email);
      return res.status(409).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const [salt, storedHashedPassword] = user.password.split(':');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');

    if (hashedPassword === storedHashedPassword) {
      req.session.userId = user._id;
      req.session.email = user.email;
      logger.log(req, 'Password matched', user._id, user.email);

      if (email === process.env.ADMIN_EMAIL) {
        // Generate and send a random code to the admin's email
        const generatedCode = generateRandomCode();
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PSW,
          },
        });

        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: email,
          subject: 'Random Code for Login',
          text: `Your random code for login is: ${generatedCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.log(req, `Error sending email to ${email}: ${error.message}`, user._id, user.email);
          } else {
            logger.log(req, `Email sent to ${email}`, user._id, user.email);
          }
        });

        return res.status(201).json({ message: 'Random code sent to email', sessionID: req.sessionID, redirectTo: '/AdminHome', generatedCode });
      }

      return res.status(201).json({ message: 'Login successful', sessionID: req.sessionID, redirectTo: '/home' });
    } else {
      logger.log(req, 'Password mismatch', user._id, user.email);
      return res.status(409).json({ error: 'Invalid password' });
    }
  } catch (error) {
    logger.log(req, `Internal Server Error: ${error.message}`, null, email);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Check code function
exports.checkCode = async (req, res) => {
  try {
    const { code } = req.body;
    logger.log(req, 'Code verification attempt', req.session.userId, req.session.email);

    // Check if the provided code matches the generated code
    if (code === req.session.generatedCode) {
      logger.log(req, 'Code verified successfully', req.session.userId, req.session.email);
      return res.status(200).json({ message: 'Code verified successfully' });
    } else {
      logger.log(req, 'Invalid code', req.session.userId, req.session.email);
      return res.status(400).json({ error: 'Invalid code', redirectTo: '/home' });
    }
  } catch (error) {
    logger.log(req, `Error checking code: ${error.message}`, req.session.userId, req.session.email);
    return res.status(500).json({ error: 'Internal Server Error', redirectTo: '/home' });
  }
};

// Register user function
exports.registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    logger.log(req, 'User registration attempt', null, email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.log(req, 'Email already exists', null, email);
      return res.status(409).json({ error: 'Email already exists' });
    }

    const sanitizedUsername = escapeHTML(req.body.username).replace(/<\/?[^>]+(>|$)/g, "");
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      username: sanitizedUsername,
    });

    logger.log(req, 'User created successfully', newUser._id, newUser.email);
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    logger.log(req, `Error inserting user: ${error.message}`, null, req.body.email);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Logout function
exports.logoutUser = async (req, res) => {
  try {
    logger.log(req, 'Logout attempt', req.session.userId, req.session.email);
    req.session.destroy(err => {
      if (err) {
        logger.log(req, `Error destroying session: ${err.message}`, req.session.userId, req.session.email);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.clearCookie('connect.sid', { path: '/' });
      logger.log(req, 'Logout successful', null, null);
      return res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    logger.log(req, `Error logging out: ${error.message}`, req.session.userId, req.session.email);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User purchase function
exports.userBuy = [
  async (req, res) => {
    try {
      const { email, productIds } = req.body;
      logger.log(req, 'User purchase attempt', req.session.userId, email);

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        logger.log(req, 'User does not exist', null, email);
        return res.status(409).json({ error: 'User does not exist' });
      }

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        logger.log(req, 'Invalid product IDs', req.session.userId, email);
        return res.status(409).json({ error: 'Invalid product IDs' });
      }

      const products = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        logger.log(req, 'Some products not found', req.session.userId, email);
        return res.status(409).json({ error: 'Some products not found' });
      }

      existingUser.products = products.map(product => product._id);
      await existingUser.save();
      logger.log(req, 'Products added to user successfully', existingUser._id, email);
      return res.status(200).json({ message: 'Products added to user successfully', user: existingUser });
    } catch (error) {
      logger.log(req, `Error updating user: ${error.message}`, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

// Find product function
exports.findProduct = [
  async (req, res) => {
    try {
      const { email } = req.body;
      logger.log(req, 'Product search attempt', req.session.userId, email);

      const user = await User.findOne({ email });
      if (!user) {
        logger.log(req, 'User not found', null, email);
        return res.status(409).json({ error: 'User not found' });
      }

      const productIds = user.products.map(product => product._id);
      const products = await Product.find({ _id: { $in: productIds } });

      logger.log(req, 'Products found successfully', user._id, email);
      return res.status(200).json({ products });
    } catch (error) {
      logger.log(req, `Error finding products: ${error.message}`, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];
