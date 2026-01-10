const container = document.getElementById('products-container');
const loading = document.getElementById('loading');

    // Async function to fetch products
    async function loadProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=10');
        const data = await response.json();
        const products = data.products;

        // Remove loading text
        loading.style.display = 'none';

        // Loop through products and create HTML
        products.forEach(product => {
          const card = document.createElement('div');
          card.className = 'glass-card rounded-2xl overflow-hidden border border-gray-100 shadow-sm';
          card.setAttribute('data-aos', 'zoom-in');
          card.setAttribute('data-aos-delay', '100');
          card.innerHTML = `
            <div class="relative bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
              <img src="${product.thumbnail}" alt="${product.title}" class="object-cover h-full w-full">
              <span class="absolute top-3 left-3 bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                ${product.category}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-gray-900 text-lg">${product.title}</h3>
              <p class="text-purple-600 font-bold text-xl mt-1">$${product.price}</p>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 py-2 rounded-lg border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition">Edit</button>
                <button class="flex-1 py-2 rounded-lg border border-red-100 text-red-500 font-semibold hover:bg-red-50 transition">Delete</button>
              </div>
            </div>
          `;
          container.appendChild(card);
        });

      } catch (error) {
        loading.textContent = 'Failed to load products. Please try again later.';
        console.error('Error fetching products:', error);
      }
    }

    // Call the function on page load
    loadProducts();