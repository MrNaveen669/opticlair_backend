// const mongoose = require("mongoose");

// const cartSchema = mongoose.Schema({
//   imageTsrc: String,
//   productRefLink: String,
//   rating: String,
//   colors: String,
//   price: String,
//   mPrice: String,
//   name: String,
//   shape: String,
//   gender: String,
//   style: String,
//   dimension: String,
//   productType: String,
//   productId: String,
//   userRated: String,
//   quntity: String,
//   id: Number,
// });

// const CartModel = mongoose.model("cart", cartSchema);

// module.exports = {
//   CartModel,
// };
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  // Remove the _id field declaration - let MongoDB generate it automatically
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
  productId: String, // Keep this for referencing the product
  userRated: String,
  quantity: Number
}, {
  versionKey: false
});

// Keep the compound index to prevent duplicates per user
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartModel = mongoose.model("cart", cartSchema);

module.exports = { CartModel };