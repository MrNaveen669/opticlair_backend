const mongoose = require("mongoose");

const sampleProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String } // Store image URL
});

const SampleProduct = mongoose.model("SampleProduct", sampleProductSchema);

module.exports = { SampleProduct };
