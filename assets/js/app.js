
        // ============================
        // JS for Inventory Management
        // ============================

        const API = "https://dummyjson.com/products";
        const container = document.getElementById('products-container');
        const loading = document.getElementById('loading');

        // Add Product Modal
        const productForm = document.getElementById('add-product-form');
        const productModalEl = document.getElementById('product-modal');
        const modal = new Modal(productModalEl);

        // Edit Product Modal
        const editForm = document.getElementById('edit-product-form');
        const editIdInput = document.getElementById('edit-id');
        const editNameInput = document.getElementById('edit-name');
        const editPriceInput = document.getElementById('edit-price');
        const editModalEl = document.getElementById('edit-product-modal');
        const editModal = new Modal(editModalEl);

        // --- Create product card ---
        function createProductCard(product) {
            const card = document.createElement('div');
            card.className = 'glass-card rounded-2xl overflow-hidden border border-gray-100 shadow-sm';
            card.setAttribute('data-aos', 'zoom-in');
            card.setAttribute('data-aos-delay', '100');
            card.dataset.id = product.id;

            card.innerHTML = `
                <div class="relative bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
                    <img src="${product.imageUrl || product.thumbnail || 'https://via.placeholder.com/300'}" 
                         alt="${product.title}" class="object-cover h-full w-full">
                    <span class="absolute top-3 left-3 bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    ${product.category || ''}
                    </span>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-gray-900 text-lg">${product.title}</h3>
                    <p class="text-purple-600 font-bold text-xl mt-1">$${product.price || 0}</p>
                    <div class="mt-4 flex gap-2">
                        <button class="flex-1 py-2 rounded-lg border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition btn-edit">Edit</button>
                        <button class="flex-1 py-2 rounded-lg border border-red-100 text-red-500 font-semibold hover:bg-red-50 transition btn-delete">Delete</button>
                    </div>
                </div>
            `;

            // Delete functionality
            card.querySelector('.btn-delete').addEventListener('click', async () => {
                if (!confirm(`Are you sure you want to delete "${product.title}"?`)) return;
                try {
                    const res = await fetch(`${API}/${product.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Delete failed');
                    card.remove();
                    alert(`Product "${product.title}" deleted!`);
                } catch (err) {
                    console.error(err);
                    alert('Failed to delete product.');
                }
            });

            // Edit functionality
            card.querySelector('.btn-edit').addEventListener('click', () => {
                editIdInput.value = product.id;
                editNameInput.value = product.title;
                editPriceInput.value = product.price || 0;
                editModal.show();
            });

            container.appendChild(card);
        }

        // --- Load products ---
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
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById("name").value.trim();
            const price = Number(document.getElementById("price").value.trim()) || 0;
            const category = document.getElementById("category").value;
            const imageUrl = document.getElementById("image-url").value.trim();

            if (!title || !category || !imageUrl) {
                alert("Please fill all fields.");
                return;
            }

            try {
                const res = await fetch(`${API}/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, price, category, imageUrl })
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.message || "Add failed");
                createProductCard(result);
                productForm.reset();
                modal.hide();
                alert("Product added!");
            } catch (err) {
                console.error(err);
                alert("Failed to add product.");
            }
        });

        // --- Edit product submit ---
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = editIdInput.value;
            const title = editNameInput.value.trim();
            const price = Number(editPriceInput.value.trim()) || 0;

            if (!title) return alert("Please fill all fields.");

            try {
                const res = await fetch(`${API}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, price })
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.message || "Update failed");

                // Update card in UI
                const card = container.querySelector(`.glass-card[data-id='${id}']`);
                if (card) {
                    card.querySelector('h3').textContent = result.title;
                    card.querySelector('p').textContent = `$${result.price}`;
                }
                editModal.hide();
                alert("Product updated!");
            } catch (err) {
                console.error(err);
                alert("Failed to update product.");
            }
        });