// Attach event listener to the Logout button
document.querySelector('a[href="/Frontend/html/index.html"]').addEventListener('click', function(event) {
    // Prevent the default action of navigating to the logout page
    event.preventDefault();
  
    // Use history API to prevent back navigation
    window.history.pushState({}, '', window.location.href);
  
    // Redirect to the logout page
    setTimeout(() => {
      window.location.href = '/Frontend/html/index.html';
    }, 500); // Optional delay before redirection
  });
  
  // Prevent back navigation
  window.addEventListener('popstate', function(event) {
    window.history.pushState({}, '', window.location.href);
  });
  