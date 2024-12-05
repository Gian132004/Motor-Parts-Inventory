const mongoose = require('mongoose'); // Import mongoose

// Define the Product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    stock: {
        type: Number,
        required: true,
        min: 0, // Ensures stock is non-negative
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensures price is non-negative
    },
    image: {
        type: String,
        required: true, // Store the image path
    },
});

const Product = mongoose.model('motorpartsproducts', productSchema);

module.exports = Product; // Export the model
