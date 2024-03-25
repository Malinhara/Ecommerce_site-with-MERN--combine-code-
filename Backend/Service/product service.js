const Product = require('../model/product model');

exports.addProduct = async (req, res) => {

  try {
    await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      imageUrl: req.body.imageUrl
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

    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update all fields with user input data
    existingProduct.name = req.body.name;
    existingProduct.description = req.body.description;
    existingProduct.price = req.body.price;
    existingProduct.category = req.body.category;
    existingProduct.quantity = req.body.quantity;
    existingProduct.imageUrl = req.body.imageUrl;

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.Id;
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
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
