document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Collect form data
    const email = document.querySelector('.frame1').value;
    const password = document.querySelector('.frame2').value;

    try {
        // Send login request to the server
        const response = await fetch('http://localhost:5500/api/route/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password }), // Map email to username
        });

        // Handle response
        if (response.ok) {
            const data = await response.json();
            alert('Login successful! Redirecting...');
            window.location.href = '/Frontend/html/dashboard.html'; // Redirect on success
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.message || 'Invalid credentials'}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in. Please try again.');
    }
});
