const express = require('express');
const router = express.Router();
const { logoutUser } = require('../controllers/authController'); // Import the logoutUser function from the controller

// Existing login route...
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists in MongoDB
        const user = await Login.findOne({ username, password });

        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route
router.post('/logout', logoutUser);  // Add this route for logging out

module.exports = router;