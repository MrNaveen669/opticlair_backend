// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema({
//   productId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'SampleProduct' 
//   },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, default: 1 },
//   size: { type: String },
//   colors: { type: String },
//   imageTsrc: { type: String }
// });

// const shippingAddressSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
//   first_name: { type: String, required: true },
//   last_name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   pincode: { type: String, required: true },
//   country: { type: String, default: "India" }
// });

// const orderSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'user',
//     required: true
//   },
//   orderId: { 
//     type: String, 
//     required: true,
//     unique: true
//   },
//   items: [orderItemSchema],
//   shippingAddress: shippingAddressSchema,
//   totalAmount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
//     default: 'Processing'
//   },
//   paymentId: { type: String },
//   paymentMethod: { type: String, default: "Razorpay" },
//   orderDate: { type: Date, default: Date.now },
//   estimatedDelivery: { type: Date },
//   notes: { type: String }
// }, { 
//   timestamps: true // Adds createdAt and updatedAt timestamps
// });

// // Generate a unique order ID before saving
// orderSchema.pre('save', function(next) {
//   if (!this.orderId) {
//     // Create format: ORD-YYYYMMDD-XXXXX (where X is a random digit)
//     const date = new Date();
//     const dateStr = date.getFullYear().toString() +
//                    (date.getMonth() + 1).toString().padStart(2, '0') +
//                    date.getDate().toString().padStart(2, '0');
//     const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
//     this.orderId = `ORD-${dateStr}-${random}`;
//   }
//   next();
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = { Order };
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SampleProduct' 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String },
  colors: { type: String },
  imageTsrc: { type: String }
});

const shippingAddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  orderId: { 
    type: String, 
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  paymentId: { type: String },
  paymentMethod: { type: String, default: "Razorpay" },
  orderDate: { type: Date, default: Date.now },
  estimatedDelivery: { type: Date },
  notes: { type: String }
}, { 
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Generate a unique order ID before saving (improved version)
orderSchema.pre('save', async function(next) {
  if (!this.orderId && this.isNew) {
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        // Create format: ORD-YYYYMMDD-XXXXX (where X is a random digit)
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
                       (date.getMonth() + 1).toString().padStart(2, '0') +
                       date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const orderId = `ORD-${dateStr}-${random}`;
        
        // Check if this orderId already exists
        const existingOrder = await this.constructor.findOne({ orderId });
        if (!existingOrder) {
          this.orderId = orderId;
          break;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          // Fallback to timestamp-based ID
          this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
      } catch (error) {
        console.error('Error generating orderId:', error);
        // Fallback to timestamp-based ID
        this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        break;
      }
    }
  }
  next();
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };