const express = require("express");
const { ProductModel } = require("../Models/product.model");

const productRouter = express.Router();
productRouter.use(express.json());

// GET all products with filtering, sorting, and pagination
productRouter.get("/", async (req, res) => {
  try {
    const query = {};
    
    // Build query filters from request parameters
    if (req.query.rating) {
      query.rating = req.query.rating;
    }
    if (req.query.colors) {
      query.colors = { $regex: req.query.colors };
    }
    if (req.query.price) {
      query.price = req.query.price;
    }
    if (req.query.mPrice) {
      query.mPrice = req.query.mPrice;
    }
    if (req.query.shape) {
      query.shape = req.query.shape;
    }
    if (req.query.gender) {
      query.gender = { $regex: req.query.gender };
    }
    if (req.query.style) {
      query.style = req.query.style;
    }
    if (req.query.dimension) {
      query.dimension = req.query.dimension;
    }
    if (req.query.productType) {
      query.productType = req.query.productType;
    }
    if (req.query.userRated) {
      query.userRated = req.query.userRated;
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.productRefLink) {
      query.productRefLink = { $regex: req.query.productRefLink, $options: "i" };
    }

    // Set up sort options
    const sortOption = {};
    if (req.query.sort === "lowtohigh") {
      sortOption.price = 1;
    } else if (req.query.sort === "hightolow") {
      sortOption.price = -1;
    }

    // Calculate pagination
    const page = parseInt(req.query.page) || 0;
    const limit = 12;
    const skip = page * limit;

    // Execute query with modern promise-based approach
    const products = await ProductModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET a single product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    
    if (product) {
      res.status(200).json({
        success: true,
        product: product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
  } catch (err) {
    console.log({ err: err });
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST a new product
productRouter.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const newProduct = new ProductModel(payload);
    await newProduct.save();
    res
      .status(201)
      .json({ newProduct, message: "New Products successfully Added" });
  } catch (err) {
    console.log("err :", err);
    res.status(400).json({ message: err.message });
  }
});

// POST many products at once
productRouter.post("/many", async (req, res) => {
  const payload = req.body;
  try {
    const newProduct = await ProductModel.insertMany(payload);
    res.status(201).json(newProduct);
  } catch (err) {
    console.log("err :", err);
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update) a product
productRouter.patch("/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      payload,
      { new: true } // This returns the updated document
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Successfully Updated the product",
      product: product,
    });
  } catch (err) {
    console.log({ err: err, message: "Product Update Error!" });
    res.status(400).json({ success: false, message: "Product Update Error!", error: err.message });
  }
});

// DELETE a product
productRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await ProductModel.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.status(200).json({ success: true, message: "Deleted The Product" });
  } catch (err) {
    console.log("err :", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = {
  productRouter,
};