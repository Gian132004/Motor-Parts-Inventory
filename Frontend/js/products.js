document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const searchButton = document.getElementById('searchButton'); // Make sure to use the correct button ID
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    } else {
        console.error('Search button not found.');
    }
});

let allProducts = []; // Global variable to store all products

// Fetch all products from the backend API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5500/api/products/all');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const products = await response.json();
        allProducts = products; // Store all products globally
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load products');
    }
}

// Display products in the DOM
function displayProducts(products) {
    const productsContainer = document.querySelector('#productsContainer');
    productsContainer.innerHTML = ''; // Clear any existing products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'card');
        productCard.style.margin = '10px';
        productCard.style.width = '16rem';

        productCard.innerHTML = `
            <img src="http://localhost:5500/images/${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Stocks: ${product.stock}</p>
                <p class="card-text">Price: ₱${product.price}</p>
                <button class="btn btn-warning text-white editBtn fw-bold" data-id="${product._id}">Edit</button>
                <button class="btn btn-danger deleteBtn fw-bold" data-id="${product._id}">Delete</button>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });

    // Attach event listeners to the Edit and Delete buttons
    document.querySelectorAll('.editBtn').forEach(btn => 
        btn.addEventListener('click', (e) => openEditModal(e.target.dataset.id)));
    document.querySelectorAll('.deleteBtn').forEach(btn => 
        btn.addEventListener('click', (e) => deleteProduct(e.target.dataset.id)));
}

// Search products by name
function searchProducts() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    if (!searchQuery) {
        displayProducts(allProducts); // If no search query, display all products
        return;
    }

    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchQuery)
    );

    displayProducts(filteredProducts); // Display the filtered products
}

// Add a new product
document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('productTitle').value);
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('productImage', document.getElementById('productImage').files[0]);

    try {
        const response = await fetch('http://localhost:5500/api/products/create', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const newProduct = await response.json();
            alert('Product added successfully');
            fetchProducts(); // Refresh the product list
            document.getElementById('addProductForm').reset();
            document.getElementById('addProductModal').querySelector('.btn-close').click();
        } else {
            const error = await response.json();
            alert('Failed to add product: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add product');
    }
});

// Open the Edit Modal with product details
async function openEditModal(productId) {
    try {
        const response = await fetch('http://localhost:5500/api/products/all');
        const products = await response.json();
        const product = products.find(p => p._id === productId);

        if (!product) {
            alert('Product not found!');
            return;
        }

        // Populate the form with the product data
        document.getElementById('editProductTitle').value = product.title;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductForm').dataset.id = product._id; // Set dataset.id

        // Check if the product has an image and update the image preview
        if (product.image) {
            document.getElementById('editImagePreview').style.display = 'block';
            document.getElementById('editPreviewImg').src = `http://localhost:5500/images/${product.image}`; // Corrected path
        } else {
            document.getElementById('editImagePreview').style.display = 'none';
        }

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load product details');
    }
}

// Update a product
document.getElementById('editProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const productId = e.target.dataset.id;
    if (!productId) {
        alert('Product ID is missing!');
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('editProductTitle').value);
    formData.append('stock', document.getElementById('editProductStock').value);
    formData.append('price', document.getElementById('editProductPrice').value);

    const fileInput = document.getElementById('editProductImage');
    if (fileInput.files[0]) {
        formData.append('productImage', fileInput.files[0]);
    }

    try {
        const response = await fetch(`http://localhost:5500/api/products/update/${productId}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            alert('Product updated successfully');
            fetchProducts(); // Refresh the product list
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide(); // Close the modal
        } else {
            const error = await response.json();
            alert('Failed to update product: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update product');
    }
});

// Delete a product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/products/delete/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Product deleted successfully');
            fetchProducts(); // Refresh the product list
        } else {
            const error = await response.json();
            alert('Failed to delete product: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product');
    }
}
