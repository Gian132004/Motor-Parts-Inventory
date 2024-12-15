// Load environment variables
require('dotenv').config();



// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

// Import routes
const sysroute = require('./routes/route'); // Example route
const productRoutes = require('./routes/productRoutes'); // Product-related routes
const saleRoutes = require('./routes/saleRoute');




// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/api/route', sysroute); // Example route
app.use('/api/products', productRoutes); // Must match the path you're calling
// Serve static files (e.g., product images) from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/sales', saleRoutes);





// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if the database connection fails
  }
};


// Start the server
const startServer = async () => {
  await connectDB(); // Connect to MongoDB
  const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
