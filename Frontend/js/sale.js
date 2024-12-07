document.addEventListener('DOMContentLoaded', fetchSales);

let salesData = []; // Store all sales data
let currentPage = 1; // Current page for pagination
const itemsPerPage = 5; // Items per page

// Fetch sales data from the API
async function fetchSales() {
    try {
        const response = await fetch('http://localhost:5500/api/sales/all');
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }

        salesData = await response.json();

        // Sort sales by date in descending order (latest first)
        salesData.reverse();
        salesData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update total sold count and total sales
        updateTotalSold(salesData);
        updateTotalSales(salesData);

        // Display the sales data
        displaySales(salesData);
    } catch (error) {
        console.error('Error fetching sales:', error);
        alert('Failed to load sales data');
    }
}

// Update total sold count for overall sales (total from all data)
function updateTotalSold(sales) {
    const totalSold = sales.reduce((total, sale) => total + sale.quantity, 0);
    document.getElementById('totalSold').textContent = totalSold;
}

function updateTotalSales(sales) {
    const totalSales = sales.reduce((total, sale) => total + (sale.quantity * sale.price), 0);
    document.getElementById('totalSales').textContent = `₱${totalSales.toFixed(2)}`;
}

// Display sales data in the table with pagination
function displaySales(sales) {
    const salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = ''; // Clear any existing rows

    // Calculate pagination indices
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const salesToDisplay = sales.slice(start, end);

    // Render the sales in the table
    salesToDisplay.forEach((sale) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
            <td>₱${sale.price.toFixed(2)}</td>
            <td>₱${(sale.quantity * sale.price).toFixed(2)}</td>
        `;
        salesTableBody.appendChild(row);
    });

    // Update pagination buttons
    updatePaginationButtons(sales);
}

// Apply filters to the sales data
function filterSales() {
    const day = document.getElementById('dayFilter').value;
    const month = document.getElementById('monthFilter').value;
    const year = document.getElementById('yearFilter').value;

    // Filter sales based on day, month, and year
    const filteredSales = salesData.filter((sale) => {
        const [saleYear, saleMonth, saleDay] = sale.date.split('-');
        return (
            (!day || saleDay === day.padStart(2, '0')) &&
            (!month || saleMonth === month.padStart(2, '0')) &&
            (!year || saleYear === year)
        );
    });

    // Sort the filtered sales by date in descending order (latest first)
    filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Reset to the first page after applying the filter
    currentPage = 1;
    displaySales(filteredSales);

    // Update totals for the filtered sales
    updateTotalSold(filteredSales); // Update total sold for filtered sales
    updateTotalSales(filteredSales); // Update total sales for filtered sales
}

// Clear filters and reset the table
function clearFilters() {
    document.getElementById('dayFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('yearFilter').value = '';

    currentPage = 1; // Reset to the first page
    displaySales(salesData); // Display all sales again

    // Update the total sold count and total sales for unfiltered data
    updateTotalSold(salesData);
    updateTotalSales(salesData);
}

// Update the pagination buttons
function updatePaginationButtons(sales) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    // Back button
    if (currentPage > 1) {
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary me-2';
        backButton.textContent = 'Back';
        backButton.onclick = () => {
            currentPage--;
            displaySales(sales);
        };
        paginationContainer.appendChild(backButton);
    }

    // Next button
    if (currentPage * itemsPerPage < sales.length) {
        const nextButton = document.createElement('button');
        nextButton.className = 'btn btn-secondary';
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            displaySales(sales);
        };
        paginationContainer.appendChild(nextButton);
    }
}
