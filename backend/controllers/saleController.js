const Sale = require('../models/saleModel');

// Create a new sale
const createSale = async (req, res) => {
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
};

// Get all sales
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ date: -1 }); // Latest sales first
        res.status(200).json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createSale, getSales };
