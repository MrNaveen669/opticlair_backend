const express = require('express');
const router = express.Router();
const Wishlist = require('../Models/wishlist.model');

// Get all wishlist items for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.params.userId });
    res.json(wishlistItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item to wishlist
router.post('/', async (req, res) => {
  try {
    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      userId: req.body.userId,
      productId: req.body.productId
    });

    if (existingItem) {
      return res.status(400).json({ msg: "Item already in wishlist" });
    }

    const wishlistItem = new Wishlist(req.body);
    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error code
      return res.status(400).json({ msg: "Item already in wishlist" });
    }
    res.status(500).json({ msg: err.message });
  }
});

// Delete an item from wishlist
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Wishlist.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ msg: "Item not found" });
    }
    
    res.status(200).json({ status: 200, msg: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
// module.exports = {
//         userRouter,
//       };
      