// controllers/orderController.js
const { Order } = require('../Models/order.model'); // Adjust path if needed
const { v4: uuidv4 } = require('uuid');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentId, status, estimatedDelivery, shippingAddress, totalAmount } = req.body;
    
    // Create unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Get user ID from authenticated request
    const userId = req.user._id;
    
    // Create new order
    const newOrder = new Order({
      userId,
      orderId,
      items,
      paymentId,
      status,
      estimatedDelivery,
      shippingAddress,
      totalAmount
    });
    
    await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: orderId
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user._id;
    
    // Find all orders for this user
    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 }); // Sort by newest first
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    
    // Find the order
    const order = await Order.findOne({ 
      orderId: orderId,
      userId: userId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// Update order status (can be used for admin panel)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate status value
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    
    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};