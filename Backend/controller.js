const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const userService = require('./Service/User service');
const productService = require('./Service/product service');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



// Routes
const userRouter = express.Router();
userRouter.post('/register', userService.registerUser);
userRouter.post('/login', userService.loginUser);
userRouter.put('/buyProduct', userService.userBuy);
userRouter.post('/findproduct', userService.findproduct);
app.post('/logout', userService.logoutUser);
app.use('/user', userRouter); // Mount userRouter under '/user' path

const productRouter = express.Router();
productRouter.post('/addProduct', productService.addProduct);
productRouter.put('/update/:Id', productService.updateProduct);
productRouter.delete('/delete/:Id', productService.deleteProduct);
productRouter.get('/productIds', productService.getAllProducts);
productRouter.get('/getproduct/:Id', productService.getoneProduct);
app.use('/product', productRouter); // Mount productRouter under '/product' path


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Shop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
