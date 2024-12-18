document.addEventListener('DOMContentLoaded', fetchDashboardData);

// Add the logout function to your dashboard.js
async function logoutUser() {
  try {
    const response = await fetch('http://localhost:5500/api/route/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
      }).then(() => {
        window.location.href = '/Frontend/html/index.html'; // Redirect to the login page or any desired page
      });
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: errorData.message || 'An error occurred while logging out.',
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    Swal.fire({
      icon: 'error',
      title: 'Logout Failed',
      text: 'An error occurred while logging out. Please try again.',
    });
  }
}


async function fetchDashboardData() {
  try {
    const response = await fetch('http://localhost:5500/api/sales/dashboard-summary'); // Adjust port if needed
    if (!response.ok) throw new Error('Failed to fetch dashboard data');

    const data = await response.json();

    // Populate Summary Cards
    document.getElementById('totalStocks').textContent = data.totalStocks.toLocaleString();
    document.getElementById('totalSales').textContent = data.totalSales.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });

    // Populate Charts
    updateSalesLineChart(data.monthlySales);
    updateSoldBarChart(data.productQuantities);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
}

// Update the sales line chart
function updateSalesLineChart(monthlySales) {
  const labels = monthlySales.map((entry) => entry._id); // Month-Year
  const values = monthlySales.map((entry) => entry.totalSales);

  new Chart(document.getElementById('salesLineChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Sales Revenue (₱)',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      }],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });
}

// Update the sold products bar chart
function updateSoldBarChart(productQuantities) {
  const labels = productQuantities.map((entry) => entry._id); // Product names
  const values = productQuantities.map((entry) => entry.totalQuantity);

  new Chart(document.getElementById('soldBarChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Products Sold (Qty)',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });
}
