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
