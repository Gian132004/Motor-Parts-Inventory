document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    } else {
        console.error('Checkout button not found.');
    }

    const searchButton = document.getElementById('searchButton'); // Make sure to use the correct button ID
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    } else {
        console.error('Search button not found.');
    }
});

let cart = [];
let allProducts = [];

// Fetch all products from the backend API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5500/api/products/all');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const products = await response.json();
        allProducts = products; // Save all products for search functionality
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load products');
    }
}

// Display products in the DOM
function displayProducts(products) {
    const productList = document.querySelector('.product-list .row');
    if (!productList) {
        console.error('Product list container not found.');
        return;
    }

    productList.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'col-md-4');

        productCard.innerHTML = `
            <div class="card shadow-sm">
                <img src="http://localhost:5500/images/${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Price: ₱${product.price}</p>
                    <p class="card-text">Stock: ${product.stock}</p>
                    <button class="btn btn-primary add-product" 
                            data-id="${product._id}" 
                            data-name="${product.title}" 
                            data-price="${product.price}" 
                            data-stock="${product.stock}">
                        Add Product
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    // Add event listeners to "Add Product" buttons
    document.querySelectorAll('.add-product').forEach(button => {
        button.addEventListener('click', addProductToCart);
    });
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

    displayProducts(filteredProducts);
}

// Add product to the cart
function addProductToCart(e) {
    const button = e.target;
    const productId = button.dataset.id;
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);
    let productStock = parseInt(button.dataset.stock);

    if (productStock <= 0) {
        alert(`Product "${productName}" is out of stock.`);
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        if (existingProduct.quantity < productStock) {
            existingProduct.quantity++;
        } else {
            alert(`Only ${productStock} units available for "${productName}".`);
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            stock: productStock
        });
    }

    renderCart();
}

// Remove product from cart
function removeProductFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Update product quantity in cart
function updateProductQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (!product) return;

    product.quantity += change;
    if (product.quantity <= 0) {
        removeProductFromCart(productId);
    } else if (product.quantity > product.stock) {
        product.quantity = product.stock;
        alert(`Only ${product.stock} units available for "${product.name}".`);
    }
    renderCart();
}

// Render cart in the current product section
function renderCart() {
    const cartList = document.getElementById('current-product-list');
    const totalAmount = document.getElementById('total-amount');

    if (!cartList || !totalAmount) {
        console.error('Cart or total amount element not found.');
        return;
    }

    cartList.innerHTML = ''; // Clear previous cart
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span style="white-space: nowrap;">₱${(item.price * item.quantity).toFixed(2)}</span>
            <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-secondary me-1" onclick="updateProductQuantity('${item.id}', -1)">-</button>
                <button class="btn btn-sm btn-secondary me-1" onclick="updateProductQuantity('${item.id}', 1)">+</button>
                <button class="btn btn-sm btn-danger" onclick="removeProductFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    totalAmount.textContent = `₱${total.toFixed(2)}`;
}

// Checkout and display a receipt
async function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty. Please add products.');
        return;
    }

    try {
        const salesPromises = cart.map(async item => {
            // Save sale to MongoDB with price field included
            const response = await fetch('http://localhost:5500/api/sales/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: item.name,
                    quantity: item.quantity,
                    price: item.price,  // Include price in request body
                    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to save sale for ${item.name}`);
            }

            // Update product stock in the backend
            await fetch(`http://localhost:5500/api/products/update-stock/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: item.quantity }),
            });
        });

        await Promise.all(salesPromises);

        cart = [];
        renderCart();
        fetchProducts();
        alert('Checkout successful!');
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Failed to process checkout');
    }
}
