const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  marca: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: 'no-image.jpg' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);