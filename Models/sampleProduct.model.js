// const mongoose = require("mongoose");

// const sampleProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     image: { type: String } // Store image URL
// });

// const SampleProduct = mongoose.model("SampleProduct", sampleProductSchema);

// module.exports = { SampleProduct };
const mongoose = require("mongoose");

const sampleProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    gender: { type: String },
    image: { type: String }, // Main image
    images: [{ type: String }], // Array of additional images
    sizes: [{ type: String }], // Available sizes
    resolution: { type: String }, // Lens resolution
    stock: { type: String, default: "Available" }, // Stock status
    frameMaterial: { type: String }, // Frame material
    lensMaterial: { type: String }, // Lens material
    features: [{ type: String }], // Product features
    discount: { type: String, default: "0" } // Discount percentage
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const SampleProduct = mongoose.model("SampleProduct", sampleProductSchema);
module.exports = { SampleProduct };