const escapeHTML = require('escape-html');
const Product = require('../model/product model');
const userservice = require('./User service');
const authMiddleware = require('./auth/Auth.js');
const logger = require('../LogFile/Logger.js');

exports.addProduct = [
  authMiddleware,
  async (req, res) => {
    try {
      const sanitizedDesc = escapeHTML(req.body.description);
      const sanitizedImgUrl = escapeHTML(req.body.imgUrl);
      const sanitizedName = escapeHTML(req.body.name);

      await Product.create({
        name: sanitizedName,
        description: sanitizedDesc,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity,
        imageUrl: sanitizedImgUrl
      });

      logger.log(req, 'Product added successfully', req.session.userId, req.session.email);
      return res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      logger.log(req, error.message, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.updateProduct = [
  authMiddleware,
  async (req, res) => {
    try {
      const productId = req.params.Id;
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(409).json({ error: 'Product not found' });
      }

      const sanitizedDesc = escapeHTML(req.body.description);
      const sanitizedImgUrl = escapeHTML(req.body.imgUrl);
      const sanitizedName = escapeHTML(req.body.name);

      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        name: sanitizedName,
        description: sanitizedDesc,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity,
        imageUrl: sanitizedImgUrl
      }, { new: true });

      return res.status(201).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      logger.log(req, error.message, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.deleteProduct = [
  authMiddleware,
  async (req, res) => {
    try {
      const productId = req.params.Id;
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      logger.log(req, error.message, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.getAllProducts = [
  authMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find();
      return res.status(200).json({ products });
    } catch (error) {
      logger.log(req, error.message, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.getOneProduct = [
  authMiddleware,
  async (req, res) => {
    try {
      const productId = req.params.Id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ product });
    } catch (error) {
      logger.log(req, error.message, req.session.userId, req.session.email);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];
