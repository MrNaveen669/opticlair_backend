// routes/admin.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Order } = require('../Models/order.model');
const { userModel } = require('../Models/user.model');
const { isAdmin } = require('../middlwares/auth.middleware');



// Get all orders for admin
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by order ID or user email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderId: searchRegex },
        { 'shippingAddress.email': searchRegex },
        { 'shippingAddress.first_name': searchRegex },
        { 'shippingAddress.last_name': searchRegex }
      ];
    }

    const orders = await Order.find(query)
      .populate('userId', 'first_name last_name email ph_no')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

// Update order status by admin
router.patch('/orders/:orderId/status', isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

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
      { orderId: orderId },
      updateData,
      { new: true }
    ).populate('userId', 'first_name last_name email');

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
    console.error('Admin update order status error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

// Get order statistics for admin dashboard
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
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

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user count
    const totalUsers = await userModel.countDocuments();

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };

    res.status(200).json({
      success: true,
      stats: {
        ...result,
        totalUsers,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
});

// Get all users for admin
router.get('/users', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = { isAdmin: { $ne: true } }; // Exclude admin users
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { email: searchRegex }
      ];
    }

    const users = await userModel.find(query, '-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await userModel.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

// Get specific order details for admin
router.get('/orders/:orderId', isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId: orderId })
      .populate('userId', 'first_name last_name email ph_no');

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
    console.error('Admin get order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

module.exports = router;