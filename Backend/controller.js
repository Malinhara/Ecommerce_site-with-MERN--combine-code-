const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const userService = require('./Service/User service');
const productService = require('./Service/product service');
const authMiddleware = require('./Service/auth/Auth');
const PORT = 3001;
const HOST = '127.0.0.1'; // Define your host here
const app = express();



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}))
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
const userRouter = express.Router();
userRouter.post('/register',userService.registerUser);
userRouter.post('/login',userService.loginUser);
userRouter.post('/checkcode',authMiddleware, userService.checkCode);
userRouter.put('/buyProduct',authMiddleware,userService.userBuy);
userRouter.post('/findproduct', userService.findProduct);
app.post('/logout', userService.logoutUser);
app.use('/user', userRouter); // Mount userRouter under '/user' path

const productRouter = express.Router();
productRouter.post('/addProduct',authMiddleware, productService.addProduct);
productRouter.put('/update/:Id', authMiddleware,productService.updateProduct);
productRouter.delete('/delete/:Id',authMiddleware, productService.deleteProduct);
productRouter.get('/productIds',authMiddleware, productService.getAllProducts);
productRouter.get('/getproduct/:Id',authMiddleware, productService.getOneProduct);
app.use('/product', productRouter); // Mount productRouter under '/product' path

// Connect to Local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to Local MongoDB'))
  .catch(err => console.error('Error connecting to Local MongoDB:', err));

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
