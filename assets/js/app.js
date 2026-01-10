// ============================
// JS for Inventory Management
// ============================

// Base API
const API = "https://dummyjson.com/products";

// DOM elements
const productForm = document.getElementById('add-product-form');
const container = document.getElementById('products-container');
const loading = document.getElementById('loading');

// Initialize Flowbite modal
const productModalEl = document.getElementById('product-modal');
const modal = new Modal(productModalEl); // Flowbite modal instance

// --- Function to create a product card ---
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-2xl overflow-hidden border border-gray-100 shadow-sm';
    card.setAttribute('data-aos', 'zoom-in');
    card.setAttribute('data-aos-delay', '100');
    card.innerHTML = `
        <div class="relative bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
            <img src="${product.imageUrl || product.thumbnail || 'https://via.placeholder.com/300'}" 
                 alt="${product.title}" class="object-cover h-full w-full">
            <span class="absolute top-3 left-3 bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
            ${product.category}
            </span>
        </div>
        <div class="p-5">
            <h3 class="font-bold text-gray-900 text-lg">${product.title}</h3>
            <p class="text-purple-600 font-bold text-xl mt-1">$${product.price || 0}</p>
            <div class="mt-4 flex gap-2">
                <button class="flex-1 py-2 rounded-lg border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition">Edit</button>
                <button class="flex-1 py-2 rounded-lg border border-red-100 text-red-500 font-semibold hover:bg-red-50 transition">Delete</button>
            </div>
        </div>
    `;
    container.appendChild(card);
}

// --- Load initial products ---
async function loadProducts() {
    try {
        const res = await fetch(`${API}?limit=10`);
        const data = await res.json();
        loading.style.display = 'none';
        data.products.forEach(p => createProductCard(p));
    } catch (err) {
        loading.textContent = 'Failed to load products.';
        console.error(err);
    }
}
loadProducts();

// --- Add new product ---
async function saveProduct(e) {
    e.preventDefault();

    const title = document.getElementById("name").value.trim();
    const price = Number(document.getElementById("price").value.trim()) || 0;
    const category = document.getElementById("category").value;
    const imageUrl = document.getElementById("image-url").value.trim();

    if (!title || !category || !imageUrl) {
        alert("Please fill all fields.");
        return;
    }

    const product = { title, price, category, imageUrl };

    try {
        const res = await fetch(`${API}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        const result = await res.json();

        if (res.ok) {
            modal.hide(); // hide modal first
            createProductCard(result); // then add card
            productForm.reset(); // reset form
            alert("Product added!");
        } else throw new Error(result.message || "Failed");
    } catch (err) {
        console.error(err);
        alert("Failed to add product.");
    }
}

// Attach event listener
productForm.addEventListener('submit', saveProduct);
