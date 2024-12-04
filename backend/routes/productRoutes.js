const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const Product = require('../models/productModel'); // Import Product model
const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  }
});

const upload = multer({ storage: storage });

// Route to get all products
router.get('/all', getAllProducts);

// Route to create a new product with image upload
router.post('/create', upload.single('productImage'), createProduct); // 'productImage' is the field name for the file

// Route to update an existing product
router.put('/update/:id', upload.single('productImage'), updateProduct);

// Route to delete a product
router.delete('/delete/:id', deleteProduct);

// Additional route to update product stock
router.put('/update-stock/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= quantity;
    await product.save();
    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

module.exports = router;
