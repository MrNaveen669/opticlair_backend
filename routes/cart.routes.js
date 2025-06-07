
const express = require("express");
const { CartModel } = require("../Models/cart.model");
const cartRouter = express.Router();


// Get cart items for a specific user - Removed trailing slash to match frontend
// cartRouter.get("/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const cart_items = await CartModel.find({ userId });
//     res.status(200).json(cart_items);
//   } catch (err) {
//     console.error("Error in GET /cart/:userId:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// // Other routes remain the same

// // Add item to cart
// // cartRouter.post("/", async (req, res) => {
// //   const payload = req.body;
// //   try {
// //     // Make sure userId is included
// //     if (!payload.userId) {
// //       return res.status(400).json({ msg: "User ID is required" });
// //     }
    
// //     // Check if item already exists for this user
// //     const existingItem = await CartModel.findOne({ 
// //       userId: payload.userId, 
// //       productId: payload.productId 
// //     });

// //     if (existingItem) {
// //       return res.status(400).json({ msg: "Item already in cart" });
// //     }

// //     const new_cart = new CartModel(payload);
// //     await new_cart.save();
// //     res.status(201).json(new_cart);
// //   } catch (err) {
// //     if (err.code === 11000 && err.keyPattern && err.keyValue) {
// //       // Handle duplicate key error
// //       return res.status(400).json({ msg: "Item already in cart", key: err.keyValue });
// //     }
// //     console.error("Error in POST /cart:", err);
// //     res.status(500).json({ msg: "Something went wrong", error: err.message });
// //   }
// // });
// // Add item to cart
// cartRouter.post("/", async (req, res) => {
//   const payload = req.body;
//   try {
//     // Make sure userId is included
//     if (!payload.userId) {
//       return res.status(400).json({ msg: "User ID is required" });
//     }
    
//     // Check if item already exists for this user
//     const existingItem = await CartModel.findOne({ 
//       userId: payload.userId, 
//       productId: payload.productId 
//     });

//     if (existingItem) {
//       return res.status(400).json({ msg: "Item already in cart" });
//     }

//     // Remove any _id field if provided - let MongoDB generate it
//     const { _id, ...cartData } = payload;
    
//     const new_cart = new CartModel(cartData);
//     await new_cart.save();
//     res.status(201).json(new_cart);
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyValue) {
//       // Handle duplicate key error
//       return res.status(400).json({ msg: "Item already in cart", key: err.keyValue });
//     }
//     console.error("Error in POST /cart:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// // Update cart item (for quantity changes)
// cartRouter.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;
//   try {
//     const updated = await CartModel.findByIdAndUpdate(
//       id,
//       { quantity },
//       { new: true }
//     );
    
//     if (!updated) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
    
//     res.status(200).json(updated);
//   } catch (err) {
//     console.error("Error in PATCH /cart/:id:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// // Delete cart item
// cartRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = await CartModel.findByIdAndDelete(id);
    
//     if (!deleted) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
    
//     res.status(200).json({ msg: "Item removed", status: 200 });
//   } catch (err) {
//     console.error("Error in DELETE /cart/:id:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// module.exports = { cartRouter };
// cartRouter.post("/", async (req, res) => {
//   const payload = req.body;
//   try {
//     // Make sure userId is included
//     if (!payload.userId) {
//       return res.status(400).json({ msg: "User ID is required" });
//     }
    
//     // Build the search criteria for existing items
//     const searchCriteria = { 
//       userId: payload.userId, 
//       productId: payload.productId 
//     };
    
//     // If the item has lens details, include them in the search to allow
//     // same product with different lens configurations
//     if (payload.withLens && payload.lensDetails) {
//       searchCriteria.withLens = true;
//       searchCriteria['lensDetails.lensId'] = payload.lensDetails.lensId;
//     } else if (payload.withLens === false) {
//       // For frame-only items
//       searchCriteria.withLens = false;
//     }
    
//     // Check if item already exists for this user with same configuration
//     const existingItem = await CartModel.findOne(searchCriteria);

//     if (existingItem) {
//       return res.status(400).json({ 
//         msg: "Item already in cart",
//         details: "This product with the same lens configuration is already in your cart"
//       });
//     }

//     // Remove any _id field if provided - let MongoDB generate it
//     const { _id, ...cartData } = payload;
    
//     // Validate lens data if withLens is true
//     if (cartData.withLens && !cartData.isContactLens) {
//       if (!cartData.lensDetails || !cartData.lensDetails.lensId) {
//         return res.status(400).json({ 
//           msg: "Lens details are required when withLens is true" 
//         });
//       }
//     }
    
//     const new_cart = new CartModel(cartData);
//     await new_cart.save();
//     res.status(201).json(new_cart);
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyValue) {
//       // Handle duplicate key error
//       return res.status(400).json({ 
//         msg: "Item already in cart", 
//         details: "This product with the same configuration already exists in your cart",
//         key: err.keyValue 
//       });
//     }
//     console.error("Error in POST /cart:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// // Update cart item (for quantity changes)
// cartRouter.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;
//   try {
//     const updated = await CartModel.findByIdAndUpdate(
//       id,
//       { quantity },
//       { new: true }
//     );
    
//     if (!updated) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
    
//     res.status(200).json(updated);
//   } catch (err) {
//     console.error("Error in PATCH /cart/:id:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// // Delete cart item
// cartRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = await CartModel.findByIdAndDelete(id);
    
//     if (!deleted) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
    
//     res.status(200).json({ msg: "Item removed", status: 200 });
//   } catch (err) {
//     console.error("Error in DELETE /cart/:id:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });

// module.exports = { cartRouter };
// Add this GET route to your cart router to fetch user's cart items
cartRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Fetch all cart items for the specific user
    const cartItems = await CartModel.find({ userId: userId });
    
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Error in GET /cart/:userId:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Updated POST route with better error handling
cartRouter.post("/", async (req, res) => {
  const payload = req.body;
  try {
    // Make sure userId is included
    if (!payload.userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
    
    // Build the search criteria for existing items
    const searchCriteria = { 
      userId: payload.userId, 
      productId: payload.productId 
    };
    
    // If the item has lens details, include them in the search to allow
    // same product with different lens configurations
    if (payload.withLens && payload.lensDetails) {
      searchCriteria.withLens = true;
      searchCriteria['lensDetails.lensId'] = payload.lensDetails.lensId;
    } else if (payload.withLens === false) {
      // For frame-only items
      searchCriteria.withLens = false;
    }
    
    // Check if item already exists for this user with same configuration
    const existingItem = await CartModel.findOne(searchCriteria);

    if (existingItem) {
      return res.status(400).json({ 
        msg: "Item already in cart",
        details: "This product with the same lens configuration is already in your cart"
      });
    }

    // Remove any _id field if provided - let MongoDB generate it
    const { _id, ...cartData } = payload;
    
    // Validate lens data if withLens is true
    if (cartData.withLens && !cartData.isContactLens) {
      if (!cartData.lensDetails || !cartData.lensDetails.lensId) {
        return res.status(400).json({ 
          msg: "Lens details are required when withLens is true" 
        });
      }
    }
    
    const new_cart = new CartModel(cartData);
    await new_cart.save();
    res.status(201).json(new_cart);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Handle duplicate key error
      return res.status(400).json({ 
        msg: "Item already in cart", 
        details: "This product with the same configuration already exists in your cart",
        key: err.keyValue 
      });
    }
    console.error("Error in POST /cart:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Clear cart for user (useful for logout)
cartRouter.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await CartModel.deleteMany({ userId: userId });
    res.status(200).json({ msg: "Cart cleared for user", status: 200 });
  } catch (err) {
    console.error("Error in DELETE /cart/user/:userId:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Update cart item (for quantity changes)
cartRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updated = await CartModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ msg: "Item not found" });
    }
    
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error in PATCH /cart/:id:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Delete cart item
cartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await CartModel.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ msg: "Item not found" });
    }
    
    res.status(200).json({ msg: "Item removed", status: 200 });
  } catch (err) {
    console.error("Error in DELETE /cart/:id:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { cartRouter };