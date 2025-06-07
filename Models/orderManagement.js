const mongoose = require('mongoose');

const OrderManagementSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: String,
    name: String
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      color: String,
      imageSrc: String
    }
  ],
  estimatedDelivery: Date,
  deliveredAt: Date,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Changed from 'Admin' to 'User' for consistency
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('OrderManagement', OrderManagementSchema);