const express = require('express');
const router = express.Router();
const Sale = require('../models/saleModel');
const Product = require('../models/productModel'); // Import Product model

// Create a new sale
router.post('/create', async (req, res) => {
    try {
        const { title, quantity, price, date } = req.body;

        if (!title || !quantity || !price || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sale = new Sale({ title, quantity, price, date });
        await sale.save();

        res.status(201).json({ message: 'Sale recorded successfully', sale });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Existing dashboard summary route with added totalStocks and totalSales
router.get('/dashboard-summary', async (req, res) => {
    try {
        const monthlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $substr: ["$date", 0, 7] },
                    totalSales: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const productQuantities = await Sale.aggregate([
            {
                $group: {
                    _id: "$title",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { totalQuantity: -1 } },
        ]);

        // Calculate totalStocks
        const products = await Product.find();
        const totalStocks = products.reduce((sum, product) => sum + product.stock, 0);

        // Calculate totalSales
        const totalSales = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
        ]);

        res.json({
            totalStocks,
            totalSales: totalSales[0]?.total || 0, // Ensure default value if no sales exist
            monthlySales,
            productQuantities,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

// New route for fetching all sales
router.get('/all', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.json(sales);
    } catch (error) {
        console.error('Error fetching all sales:', error);
        res.status(500).json({ message: 'Failed to fetch sales data' });
    }
});

module.exports = router;
