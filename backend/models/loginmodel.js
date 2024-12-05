const mongoose = require('mongoose');

// Define the schema for the login model
const loginSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Username must be unique
    password: { type: String, required: true },              // Store passwords securely (hashed in production)
});

// Create the Login model
const Login = mongoose.model('motorpartslogin', loginSchema);

module.exports = Login;
