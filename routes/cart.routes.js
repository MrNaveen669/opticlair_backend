// const express = require("express");
// const { CartModel } = require("../Models/cart.model");
// const cartRouter = express.Router();

// cartRouter.get("/", async (req, res) => {
//   let query = req.query;
//   try {
//     const carts = await CartModel.find(query);
//     res.status(200).send(carts);
//   } catch (error) {
//     console.log(err);
//     res.status(500).send({ err: "Something went wrong" });
//   }
// });

// // cartRouter.post("/", async (req, res) => {
// //   const payload = req.body;
// //   try {
// //     const new_cart = new CartModel(payload);
// //     await new_cart.save();
// //     res.status(201).send("add new cartItems");
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).send({ msg: "Something went wrong" });
// //   }
// // });
// cartRouter.post("/", async (req, res) => {
//   const payload = req.body;
//   try {
//     const new_cart = new CartModel(payload);
//     await new_cart.save();
//     res.status(201).json(new_cart);
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyValue) {
//       // Handle duplicate key error
//       return res.status(400).json({ msg: "Duplicate key error", key: err.keyValue });
//     }
//     console.error("Error in POST /cart:", err);
//     res.status(500).json({ msg: "Something went wrong", error: err.message });
//   }
// });



// cartRouter.patch("/:id", async (req, res) => {
//   const payload = req.body;
//   const id = req.params.id;
//   try {
//     const cart = await CartModel.findByIdAndUpdate({ _id: id }, payload);
//     res.status(204).send({
//       success: true,
//       msg: "Successfully Updated the cartItem",
//       carts: cart,
//     });
//     await cart.save();
//   } catch (err) {
//     console.log({ err: err, msg: " Cart Update Error!" });
//     res.send({ success: false, msg: " Cart Update Error!", err: err });
//   }
// });

// cartRouter.delete("/:id", async (req, res) => {
//   try {
//     const cartItem = await CartModel.findByIdAndDelete(req.params.id);
//     if (!cartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }
//     res.status(200).json({ status: 200, message: "Deleted the cart item" });
//   } catch (err) {
//     console.error("Error deleting cart item:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = { cartRouter };
const express = require("express");
const { CartModel } = require("../Models/cart.model");
const cartRouter = express.Router();


// Get cart items for a specific user - Removed trailing slash to match frontend
cartRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const cart_items = await CartModel.find({ userId });
    res.status(200).json(cart_items);
  } catch (err) {
    console.error("Error in GET /cart/:userId:", err);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Other routes remain the same

// Add item to cart
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

//     const new_cart = new CartModel(payload);
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
// Add item to cart
cartRouter.post("/", async (req, res) => {
  const payload = req.body;
  try {
    // Make sure userId is included
    if (!payload.userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
    
    // Check if item already exists for this user
    const existingItem = await CartModel.findOne({ 
      userId: payload.userId, 
      productId: payload.productId 
    });

    if (existingItem) {
      return res.status(400).json({ msg: "Item already in cart" });
    }

    // Remove any _id field if provided - let MongoDB generate it
    const { _id, ...cartData } = payload;
    
    const new_cart = new CartModel(cartData);
    await new_cart.save();
    res.status(201).json(new_cart);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Handle duplicate key error
      return res.status(400).json({ msg: "Item already in cart", key: err.keyValue });
    }
    console.error("Error in POST /cart:", err);
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