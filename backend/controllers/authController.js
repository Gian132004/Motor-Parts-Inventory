exports.logoutUser = (req, res, next) => {
    try {
        // If you are using JWT tokens, ensure it is sent in the request (from the frontend)
        // Clear the token from the cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set the cookie's expiration to the past
            secure: process.env.NODE_ENV === 'production', // Set 'secure' flag for production environments
        });

        // Optionally, destroy the session if you're using sessions
        req.session.destroy((err) => {
            if (err) {
                console.error('Error in session destruction:', err);
                return next(new ErrorHandler('Error in session destruction', 500));
            }

            // Send a successful response
            res.status(200).json({
                success: true,
                message: 'Logged out successfully!',
            });
        });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
