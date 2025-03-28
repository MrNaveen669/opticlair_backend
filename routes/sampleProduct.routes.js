const express = require("express");
const { SampleProduct } = require("../Models/sampleProduct.model");

const sampleProductRouter = express.Router();

// Add a sample product
sampleProductRouter.post("/add", async (req, res) => {
    try {
        const newProduct = new SampleProduct(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product added", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
});

// Get all sample products
sampleProductRouter.get("/all", async (req, res) => {
    try {
        const products = await SampleProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// Delete a product
sampleProductRouter.delete("/delete/:id", async (req, res) => {
    try {
        const product = await SampleProduct.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

module.exports = { sampleProductRouter };
