// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  imageTsrc: String,
  productRefLink: String,
  rating: String,
  colors: String,
  price: String,
  mPrice: String,
  name: String,
  shape: String,
  gender: String,
  style: String,
  dimension: String,
  productType: String,
  userRated: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to prevent duplicate items for the same user and product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);