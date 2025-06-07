// const express = require("express");
// const { Order } = require("../Models/order.model");
// const { userModel } = require("../Models/user.model");
// const { authenticate } = require("../middlwares/middleware.auth");
// const router = express.Router();

// // Get all orders for the logged-in user
// router.get("/", authenticate, async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.userId })
//       .sort({ orderDate: -1 });
    
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Failed to fetch orders", error: error.message });
//   }
// });

// // Get a specific order by orderId
// router.get("/:orderId", authenticate, async (req, res) => {
//   try {
//     const order = await Order.findOne({ 
//       orderId: req.params.orderId,
//       userId: req.userId
//     });
    
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
    
//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     res.status(500).json({ message: "Failed to fetch order", error: error.message });
//   }
// });

// // Create a new order
// router.post("/", authenticate, async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       totalAmount,
//       paymentId,
//       estimatedDelivery
//     } = req.body;
    
//     // Generate a unique order ID (format: OD-YYYYMMDD-XXXX)
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     const orderId = `OD-${year}${month}${day}-${random}`;
    
//     // Set estimated delivery date (7 days from now if not specified)
//     const deliveryDate = estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//     // Create the order
//     const order = new Order({
//       userId: req.userId,
//       orderId,
//       items,
//       shippingAddress: {
//         ...shippingAddress,
//         userId: req.userId
//       },
//       totalAmount,
//       paymentId,
//       estimatedDelivery: deliveryDate,
//       status: 'Processing'
//     });

//     await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to create order", 
//       error: error.message 
//     });
//   }
// });

// // Update order status (Admin or User can update)
// router.patch("/:orderId/status", authenticate, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     // Validate status value
//     const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }
    
//     // Find order and update status
//     const order = await Order.findOne({ orderId: req.params.orderId });
    
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
    
//     // Check if the user is the order owner (authorization)
//     if (order.userId.toString() !== req.userId) {
//       return res.status(403).json({ message: "Not authorized to update this order" });
//     }
    
//     // Only allow cancellation if order is in Processing state
//     if (status === 'Cancelled' && order.status !== 'Processing') {
//       return res.status(400).json({ 
//         message: "Cannot cancel order that is already shipped or delivered" 
//       });
//     }
    
//     // Update order status
//     order.status = status;
//     const updatedOrder = await order.save();
    
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ message: "Failed to update order status", error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { Order } = require('../Models/order.model');
const { authenticate } = require('../middlwares/auth.middleware');

// Create a new order
// router.post('/create', authenticate, async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       totalAmount,
//       paymentId,
//       paymentMethod = "Razorpay",
//       estimatedDelivery,
//       notes
//     } = req.body;

//     // Validate required fields
//     if (!items || !items.length || !shippingAddress || !totalAmount) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: items, shippingAddress, and totalAmount are required"
//       });
//     }

//     // Create new order
//     const order = new Order({
//       userId: req.userId,
//       items,
//       shippingAddress: {
//         ...shippingAddress,
//         userId: req.userId
//       },
//       totalAmount,
//       paymentId,
//       paymentMethod,
//       estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
//       notes
//     });

//     const savedOrder = await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//       error: error.message
//     });
//   }
// });
// Create a new order
router.post('/create', authenticate, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      totalAmount,
      paymentId,
      paymentMethod = "Razorpay",
      estimatedDelivery,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: items, shippingAddress, and totalAmount are required"
      });
    }

    // Generate unique order ID manually
    const generateOrderId = () => {
      const date = new Date();
      const dateStr = date.getFullYear().toString() +
                     (date.getMonth() + 1).toString().padStart(2, '0') +
                     date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      return `ORD-${dateStr}-${random}`;
    };

    // Create new order with explicit orderId
    const order = new Order({
      userId: req.userId,
      orderId: generateOrderId(), // Explicitly set orderId
      items,
      shippingAddress: {
        ...shippingAddress,
        userId: req.userId
      },
      totalAmount,
      paymentId,
      paymentMethod,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    // Handle duplicate orderId error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.orderId) {
      // Retry with a new orderId
      try {
        const retryOrder = new Order({
          userId: req.userId,
          orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Fallback unique ID
          items,
          shippingAddress: {
            ...shippingAddress,
            userId: req.userId
          },
          totalAmount,
          paymentId,
          paymentMethod,
          estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes
        });
        
        const savedRetryOrder = await retryOrder.save();
        
        return res.status(201).json({
          success: true,
          message: "Order created successfully",
          order: savedRetryOrder
        });
      } catch (retryError) {
        console.error('Retry order creation failed:', retryError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});
// Get all orders for the authenticated user
router.get('/user-orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build query
    const query = { userId: req.userId };
    if (status) {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('userId', 'first_name last_name email')
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

// Get a specific order by order ID
router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId: orderId,
      userId: req.userId
    }).populate('userId', 'first_name last_name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

// Update order status (for admin or system use)
router.patch('/update-status/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }

    const order = await Order.findOneAndUpdate(
      { orderId: orderId, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

// Cancel order (only if not shipped or delivered)
router.patch('/cancel/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      orderId: orderId,
      userId: req.userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order that is already ${order.status.toLowerCase()}`
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled"
      });
    }

    // Update order status
    order.status = 'Cancelled';
    if (reason) {
      order.notes = `Cancelled by user: ${reason}`;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
});

// Get order statistics for user
// router.get('/stats', authenticate, async (req, res) => {
//   try {
//     const userId = req.userId;

//     const stats = await Order.aggregate([
//       { $match: { userId: mongoose.Types.ObjectId(userId) } },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalAmount: { $sum: '$totalAmount' },
//           processingOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] }
//           },
//           shippedOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'Shipped'] }, 1, 0] }
//           },
//           deliveredOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
//           },
//           cancelledOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     const result = stats[0] || {
//       totalOrders: 0,
//       totalAmount: 0,
//       processingOrders: 0,
//       shippedOrders: 0,
//       deliveredOrders: 0,
//       cancelledOrders: 0
//     };

//     res.status(200).json({
//       success: true,
//       stats: result
//     });

//   } catch (error) {
//     console.error('Get order stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch order statistics",
//       error: error.message
//     });
//   }
// });
// Get order statistics for user
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Fixed: use 'new' keyword
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalAmount: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };

    res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: error.message
    });
  }
});
module.exports = router;





