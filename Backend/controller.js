const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userService = require('./Service/User service');
const productService = require('./Service/product service');
const PORT = 3001;
const HOST = '127.0.0.1'; // Define your host here
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Routes
const userRouter = express.Router();
userRouter.post('/register', userService.registerUser);
userRouter.post('/login', userService.loginUser);
userRouter.post('/checkcode', userService.checkCode);
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
const uri = "mongodb+srv://poornainvest0:psw@app.mvyhzcz.mongodb.net/userdb?retryWrites=true&w=majority";
mongoose.connect(uri, {
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
