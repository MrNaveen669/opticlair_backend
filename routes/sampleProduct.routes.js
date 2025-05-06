// const express = require("express");
// const { SampleProduct } = require("../Models/sampleProduct.model");

// const sampleProductRouter = express.Router();

// // Add a sample product
// sampleProductRouter.post("/add", async (req, res) => {
//     try {
//         const newProduct = new SampleProduct(req.body);
//         await newProduct.save();
//         res.status(201).json({ message: "Product added", product: newProduct });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding product", error });
//     }
// });

// // Get all sample products
// sampleProductRouter.get("/all", async (req, res) => {
//     try {
//         const products = await SampleProduct.find();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching products", error });
//     }
// });

// // Delete a product
// sampleProductRouter.delete("/delete/:id", async (req, res) => {
//     try {
//         await SampleProduct.findByIdAndDelete(req.params.id);
//         res.json({ message: "Product deleted" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting product", error });
//     }
// });

// module.exports = { sampleProductRouter };
const express = require("express");
const { SampleProduct } = require("../Models/sampleProduct.model");

const sampleProductRouter = express.Router();

// Add a sample product
sampleProductRouter.post("/add", async (req, res) => {
    try {
        // Validate required fields
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                requiredFields: ["name", "description", "price", "category"] 
            });
        }

        // Process arrays correctly
        const productData = {
            ...req.body,
            // Ensure these are always arrays even if they come as strings
            images: Array.isArray(req.body.images) ? req.body.images : 
                (req.body.images ? req.body.images.split(',').map(url => url.trim()) : []),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : 
                (req.body.sizes ? req.body.sizes.split(',').map(size => size.trim()) : []),
            features: Array.isArray(req.body.features) ? req.body.features : 
                (req.body.features ? req.body.features.split(',').map(feature => feature.trim()) : [])
        };

        const newProduct = new SampleProduct(productData);
        await newProduct.save();
        
        res.status(201).json({ 
            message: "Product added successfully", 
            product: newProduct 
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ 
            message: "Error adding product", 
            error: error.message 
        });
    }
});

// Get all sample products
sampleProductRouter.get("/all", async (req, res) => {
    try {
        const products = await SampleProduct.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            message: "Error fetching products", 
            error: error.message 
        });
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
        console.error("Error deleting product:", error);
        res.status(500).json({ 
            message: "Error deleting product", 
            error: error.message 
        });
    }
});

// Get a single product by ID
sampleProductRouter.get("/:id", async (req, res) => {
    try {
        const product = await SampleProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ 
            message: "Error fetching product", 
            error: error.message 
        });
    }
});

// Update a product
sampleProductRouter.put("/update/:id", async (req, res) => {
    try {
        // Process arrays correctly for update
        const updateData = {
            ...req.body,
            // Handle arrays that might come as strings
            images: Array.isArray(req.body.images) ? req.body.images : 
                (req.body.images ? req.body.images.split(',').map(url => url.trim()) : undefined),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : 
                (req.body.sizes ? req.body.sizes.split(',').map(size => size.trim()) : undefined),
            features: Array.isArray(req.body.features) ? req.body.features : 
                (req.body.features ? req.body.features.split(',').map(feature => feature.trim()) : undefined)
        };

        const updatedProduct = await SampleProduct.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true } // Returns the updated document and validates update
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ 
            message: "Product updated successfully", 
            product: updatedProduct 
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ 
            message: "Error updating product", 
            error: error.message 
        });
    }
});

module.exports = { sampleProductRouter };