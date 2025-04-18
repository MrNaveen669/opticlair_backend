// // models/orderModel.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product'
//       },
//       name: {
//         type: String,
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1
//       },
//       price: {
//         type: Number,
//         required: true
//       },
//       image: {
//         type: String
//       }
//     }
//   ],
//   shippingAddress: {
//     address: {
//       type: String
//     },
//     city: {
//       type: String
//     },
//     state: {
//       type: String
//     },
//     postalCode: {
//       type: String
//     },
//     country: {
//       type: String,
//       default: 'India'
//     }
//   },
//   paymentInfo: {
//     id: {
//       type: String
//     },
//     status: {
//       type: String,
//       default: 'pending'
//     },
//     method: {
//       type: String,
//       default: 'razorpay'
//     }
//   },
//   taxAmount: {
//     type: Number,
//     default: 0
//   },
//   shippingAmount: {
//     type: Number,
//     default: 0
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   orderStatus: {
//     type: String,
//     default: 'processing',
//     enum: ['processing', 'shipped', 'delivered', 'cancelled']
//   },
//   deliveredAt: Date,
//   paidAt: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Order', orderSchema);