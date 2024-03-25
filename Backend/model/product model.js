const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  }
 
});

// Create Product model
const Product = mongoose.model('products', productSchema);

module.exports = Product;
