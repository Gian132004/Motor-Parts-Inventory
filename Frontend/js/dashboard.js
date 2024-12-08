document.addEventListener('DOMContentLoaded', fetchDashboardData);

async function fetchDashboardData() {
  try {
    const response = await fetch('http://localhost:5500/api/sales/dashboard-summary'); // Adjust port if needed
    if (!response.ok) throw new Error('Failed to fetch dashboard data');

    const data = await response.json();

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

  const salesLineChart = new Chart(document.getElementById('salesLineChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Year Sales Revenue (₱)',
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

  const soldBarChart = new Chart(document.getElementById('soldBarChart'), {
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
