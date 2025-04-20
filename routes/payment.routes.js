// const express = require("express");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// require("dotenv").config();

// const paymentRouter = express.Router();

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dEXh9QiGf0f3IX", // Testing key
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "ZoGaKYvKfJGzVUONBhAaqHBb", // Testing secret
// });
// paymentRouter.post("/create-order", async (req, res) => {
//         try {
//           console.log("Request body:", req.body); // Log request body
//           const { amount, currency = "INR", receipt } = req.body;
      
//           if (!amount) {
//             console.log("Amount is missing"); // Log missing amount
//             return res.status(400).json({ message: "Amount is required" });
//           }
      
//           console.log("Creating order with:", { amount, currency, receipt }); // Log order details
          
//           const options = {
//             amount: amount * 100,
//             currency,
//             receipt,
//           };
      
//           const order = await razorpay.orders.create(options);
//           console.log("Order created:", order); // Log created order
          
//           res.status(200).json({
//             id: order.id,
//             amount: order.amount,
//             currency: order.currency,
//             receipt: order.receipt,
//           });
//         } catch (error) {
//           console.error("Detailed error:", error); // Log detailed error
//           res.status(500).json({ 
//             message: "Failed to create order", 
//             error: error.message,
//             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//           });
//         }
//       });

// // Create a new order
// // rify payment
// paymentRouter.post("/verify", async (req, res) => {
//   try {
//     const { 
//       razorpay_order_id, 
//       razorpay_payment_id, 
//       razorpay_signature,
//       cart,
//       amount 
//     } = req.body;

//     // Validate the payment
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "ZoGaKYvKfJGzVUONBhAaqHBb")
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     const isSignatureValid = generatedSignature === razorpay_signature;

//     if (isSignatureValid) {
//       // Save order details in the database
//       // This is where you'd typically save the order in your database
//       // const order = new Order({
//       //   razorpay_order_id,
//       //   razorpay_payment_id,
//       //   items: cart,
//       //   amount: amount,
//       //   status: "paid",
//       //   user: req.user._id, // Assuming user authentication
//       // });
//       // await order.save();

//       // For demo purposes, we'll just return success
//       res.status(200).json({
//         success: true,
//         message: "Payment verified successfully",
//         paymentId: razorpay_payment_id,
//         orderId: razorpay_order_id,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//       });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Payment verification failed", 
//       error: error.message 
//     });
//   }
// });

// // Get payment details
// paymentRouter.get("/payment/:paymentId", async (req, res) => {
//   try {
//     const { paymentId } = req.params;
    
//     const payment = await razorpay.payments.fetch(paymentId);
    
//     res.status(200).json({
//       success: true,
//       payment,
//     });
//   } catch (error) {
//     console.error("Error fetching payment:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to fetch payment details", 
//       error: error.message 
//     });
//   }
// });

// // Get all payments (admin only - you would add authentication middleware)
// paymentRouter.get("/payments", async (req, res) => {
//   try {
//     const payments = await razorpay.payments.all();
    
//     res.status(200).json({
//       success: true,
//       payments,
//     });
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to fetch payments", 
//       error: error.message 
//     });
//   }
// });

// // Refund payment
// paymentRouter.post("/refund/:paymentId", async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const { amount = 0, notes = {} } = req.body;
    
//     const refund = await razorpay.payments.refund(paymentId, {
//       amount: amount * 100, // Convert to paisa
//       notes,
//     });
    
//     res.status(200).json({
//       success: true,
//       refund,
//     });
//   } catch (error) {
//     console.error("Error processing refund:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to process refund", 
//       error: error.message 
//     });
//   }
// });

// module.exports = { paymentRouter };

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Order } = require("../Models/order.model"); // Import the Order model
require("dotenv").config();

const paymentRouter = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dEXh9QiGf0f3IX", // Testing key
  key_secret: process.env.RAZORPAY_KEY_SECRET || "ZoGaKYvKfJGzVUONBhAaqHBb", // Testing secret
});

// Create a new order
paymentRouter.post("/create-order", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      console.log("Amount is missing");
      return res.status(400).json({ message: "Amount is required" });
    }

    console.log("Creating order with:", { amount, currency, receipt });
    
    const options = {
      amount: amount * 100, // Converting to paisa
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);
    
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ 
      message: "Failed to create order", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Verify payment
paymentRouter.post("/verify", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      cart,
      amount,
      user = req.user?._id // Get user ID from request if available
    } = req.body;

    // Validate the payment
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "ZoGaKYvKfJGzVUONBhAaqHBb")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Save order details in the database if Order model and user are available
      if (Order && user) {
        const order = new Order({
          user: user,
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          paymentMethod: "Razorpay",
          paymentResult: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "completed",
          },
          totalAmount: amount,
          taxAmount: amount * 0.18, // 18% tax
          shippingAmount: 0, // Free shipping
          isPaid: true,
          paidAt: Date.now(),
          status: "Processing"
        });
        
        await order.save();
        console.log("Order saved:", order._id);
      }

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed", 
      error: error.message 
    });
  }
});

// Get payment details
paymentRouter.get("/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payment details", 
      error: error.message 
    });
  }
});

// Get all payments (admin only - you would add authentication middleware)
paymentRouter.get("/payments", async (req, res) => {
  try {
    const payments = await razorpay.payments.all();
    
    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payments", 
      error: error.message 
    });
  }
});

// Refund payment
paymentRouter.post("/refund/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount = 0, notes = {} } = req.body;
    
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paisa
      notes,
    });
    
    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process refund", 
      error: error.message 
    });
  }
});

module.exports = { paymentRouter };