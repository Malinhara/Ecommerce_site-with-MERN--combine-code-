const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const userService = require('./Service/User service');
const productService = require('./Service/product service');
// const producService = require('./Service/');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Shop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.json());

app.use(session({
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
}));

// Routes
app.post('/register', userService.registerUser);
app.post('/login',userService.loginUser); // Add login route
app.post('/addProduct', productService.addProduct);
app.put('/products/update/:Id', productService.updateProduct);
app.delete('/products/delete/:Id', productService.deleteProduct);
app.get('/products', productService.getAllProducts);

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
