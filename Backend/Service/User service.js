const User = require('../model/User model'); // Import User model
const crypto = require('crypto');
const session = require('express-session');
const escapeHtml = require('escape-html');
const Product = require('../model/product model');
const nodemailer = require('nodemailer');
const logger = require('.LogFile/logger'); // Import the logger
require('dotenv').config();



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


const authMiddleware = (req, res, next) => {
  if (req.session && req.session.userId) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    return res.status(401).json({ message: 'Unauthorized' });
  }
};




// Declare a variable to store the generated code
let generatedCode = '';

// Function to generate a random code
const generateRandomCode = () => {
  return Math.random().toString(36).substr(2, 6);
};

exports.loginUser = async (req, res) => {
    try {
        sessionMiddleware(req, res, async () => {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                logger.log(`User not found for email: ${email}`, 'N/A', 'N/A');
                return res.status(409).json({ error: 'Invalid email or password' });
            }

            const [salt, storedHashedPassword] = user.password.split(':');
            const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');

            if (hashedPassword === storedHashedPassword) {
                logger.log(`Password matched successfully`, user._id, user.username);

                const id = req.sessionID;
                module.exports.id = id;

                if (email === process.env.ADMIN_EMAIL) {
                    generatedCode = generateRandomCode();

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.ADMIN_EMAIL,
                            pass: process.env.ADMIN_PSW
                        }
                    });

                    const mailOptions = {
                        from: process.env.ADMIN_EMAIL,
                        to: email,
                        subject: 'Random Code for Login',
                        text: `Your random code for login is: ${generatedCode}`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            logger.log(`Error sending email to ${email}: ${error.message}`, user._id, user.username);
                        } else {
                            logger.log(`Email sent to ${email}: ${info.response}`, user._id, user.username);
                        }
                    });

                    return res.status(201).json({ message: 'Random code sent to email', sessionID: req.sessionID, redirectTo: '/AdminHome', generatedCode });
                }
                req.session.userId = user._id;
                return res.status(201).json({ message: 'Login successful', sessionID: req.sessionID, redirectTo: '/home', generatedCode });
            } else {
                logger.log(`Password mismatch for user: ${email}`, user._id, user.username);
                return res.status(409).json({ error: 'Invalid password' });
            }
        });
    } catch (error) {
        logger.log(`Error logging in user: ${error.message}`, 'N/A', 'N/A');
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Now you can access the generated code using the variable 'generatedCode' anywhere in your program.


exports.checkCode = async (req, res) => {
  try {
    const { code } = req.body;

    console.log(code,generatedCode);
    // Check if the provided code matches the generated code
    if (code === generatedCode) {
      // Clear the generated code after it's been used for verification

      // Return success message
      return res.status(200).json({ message: 'Code verified successfully' });
    } else {
    
    // Return error message if the code doesn't match
       return res.status(400).json({ error: 'Invalid code', redirectTo: '/home' });
 
    }
  } catch (error) {
    console.error('Error checking code:', error);
    return res.status(500).json({ error: 'Internal Server Error',redirectTo: '/home' });
  }
};


exports.registerUser = async (req, res) => {
  try {
   
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
  
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        // Log the error
        logger.log(`Error destroying session: ${err.message}`, req.session.userId || 'N/A', req.session.userName || 'N/A');
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      // Log the successful session destruction
      logger.log('Session data cleared successfully', req.session.userId || 'N/A', req.session.userName || 'N/A');
      console.log('Session data cleared successfully');
      
      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    // Log the error
    logger.log(`Error logging out: ${error.message}`, req.session.userId || 'N/A', req.session.userName || 'N/A');
    console.error('Error logging out:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.userBuy = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {
  
      const { email, productIds } = req.body;

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

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
];

exports.findproduct = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
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
}
]


module.exports = authMiddleware;
