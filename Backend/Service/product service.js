const escapeHTML = require('escape-html');
const Product = require('../model/product model');

exports.addProduct = async (req, res) => {

  try {
    
    const sessionID = req.headers['session-id']; // Adjust the header name as per your frontend code

    // Check if session ID exists
    if (!sessionID) {
      return res.status(409).json({ error: 'Unauthorized: Session ID is missing and Please Relogin' });
    }


    const sanitizedDesc = escapeHTML(req.body.description).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizedimgurl = escapeHTML(req.body.imgUrl).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizediname = escapeHTML(req.body.name).replace(/<\/?[^>]+(>|$)/g, "");

    await Product.create({
      name: sanitizediname,
      description: sanitizedDesc,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      imageUrl: sanitizedimgurl
    });
    return res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateProduct = async (req, res) => {
  try {

    const productId = req.params.Id;
    const sessionID = req.headers['session-id']; // Adjust the header name as per your frontend code

    // Check if session ID exists
    if (!sessionID) {
      return res.status(409).json({ error: 'Unauthorized: Session ID is missing and Please Relogin' });
    }
    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(409).json({ error: 'Product not found' });
    }

    const sanitizedDesc = escapeHTML(req.body.description).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizedimgurl = escapeHTML(req.body.imgUrl).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizediname = escapeHTML(req.body.name).replace(/<\/?[^>]+(>|$)/g, "");

    // Update all fields with user input data
    existingProduct.name = sanitizediname;
    existingProduct.description = sanitizedDesc ;
    existingProduct.price = req.body.price;
    existingProduct.category = req.body.category;
    existingProduct.quantity = req.body.quantity;
    existingProduct.imgUrl = sanitizedimgurl;

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    return res.status(201).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.Id;
    const sessionID = req.headers['session-id']; // Adjust the header name as per your frontend code

    // Check if session ID exists
    if (!sessionID) {
      return res.status(409).json({ error: 'Unauthorized: Session ID is missing and Please Relogin' });
    }


    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {

      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getoneProduct = async (req, res) => {
  try {
    const productId = req.params.Id; // Get the product ID from request parameters
    const product = await Product.findById(productId); // Find the product by its ID
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // Handle case when product is not found
    }
    return res.status(200).json({ product }); // Return the found product
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
