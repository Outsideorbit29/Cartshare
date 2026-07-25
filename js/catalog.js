/* ============================================================
   CartShare — Product Catalog
   Blinkit-style browsable product grid with categories
   ============================================================ */

const CartShareCatalog = (() => {

  /**
   * Product catalog data — categories and items
   */
  const CATALOG = [
    {
      id: 'fruits-vegetables',
      name: 'Fruits & Vegetables',
      emoji: '🍎',
      color: '#4CAF50',
      products: [
        { id: 'apple', name: 'Apple', price: 120, unit: '1 kg', emoji: '🍎' },
        { id: 'banana', name: 'Banana', price: 40, unit: '1 dozen', emoji: '🍌' },
        { id: 'mango', name: 'Mango (Alphonso)', price: 250, unit: '1 kg', emoji: '🥭' },
        { id: 'onion', name: 'Onion', price: 35, unit: '1 kg', emoji: '🧅' },
        { id: 'tomato', name: 'Tomato', price: 30, unit: '1 kg', emoji: '🍅' },
        { id: 'potato', name: 'Potato', price: 28, unit: '1 kg', emoji: '🥔' },
        { id: 'spinach', name: 'Spinach (Palak)', price: 25, unit: '1 bunch', emoji: '🥬' },
        { id: 'capsicum', name: 'Green Capsicum', price: 60, unit: '250 g', emoji: '🫑' }
      ]
    },
    {
      id: 'dairy-breakfast',
      name: 'Dairy & Breakfast',
      emoji: '🥛',
      color: '#2196F3',
      products: [
        { id: 'milk', name: 'Amul Toned Milk', price: 28, unit: '500 ml', emoji: '🥛' },
        { id: 'curd', name: 'Amul Curd', price: 45, unit: '400 g', emoji: '🍶' },
        { id: 'paneer', name: 'Amul Paneer', price: 80, unit: '200 g', emoji: '🧀' },
        { id: 'butter', name: 'Amul Butter', price: 56, unit: '100 g', emoji: '🧈' },
        { id: 'cheese', name: 'Amul Cheese Slices', price: 99, unit: '200 g', emoji: '🧀' },
        { id: 'eggs', name: 'Farm Fresh Eggs', price: 90, unit: '6 pcs', emoji: '🥚' },
        { id: 'oats', name: 'Quaker Oats', price: 145, unit: '1 kg', emoji: '🥣' }
      ]
    },
    {
      id: 'snacks-munchies',
      name: 'Snacks & Munchies',
      emoji: '🍿',
      color: '#FF9800',
      products: [
        { id: 'lays', name: "Lay's Classic Salted", price: 20, unit: '52 g', emoji: '🍿' },
        { id: 'kurkure', name: 'Kurkure Masala Munch', price: 20, unit: '80 g', emoji: '🌶️' },
        { id: 'namkeen', name: 'Haldiram Aloo Bhujia', price: 45, unit: '200 g', emoji: '🥜' },
        { id: 'biscuit-parle', name: 'Parle-G Biscuit', price: 10, unit: '80 g', emoji: '🍪' },
        { id: 'chocolate-dairy', name: 'Dairy Milk Silk', price: 80, unit: '60 g', emoji: '🍫' },
        { id: 'chips-wafers', name: 'Kettle Chipss', price: 99, unit: '100 g', emoji: '🍟' },
        { id: 'trail-mix', name: 'Roasted Mixture', price: 60, unit: '200 g', emoji: '🥜' },
        { id: 'popcorn', name: 'Act II Popcorn', price: 40, unit: '70 g', emoji: '🍿' }
      ]
    },
    {
      id: 'cold-drinks',
      name: 'Cold Drinks & Juices',
      emoji: '🥤',
      color: '#E91E63',
      products: [
        { id: 'coca-cola', name: 'Coca-Cola', price: 40, unit: '750 ml', emoji: '🥤' },
        { id: 'sprite', name: 'Sprite', price: 40, unit: '750 ml', emoji: '🍋' },
        { id: 'frooti', name: 'Frooti Mango', price: 30, unit: '600 ml', emoji: '🥭' },
        { id: 'tropicana', name: 'Tropicana Mixed Fruit', price: 65, unit: '1 L', emoji: '🧃' },
        { id: 'paperboat', name: 'Paper Boat Aamras', price: 30, unit: '200 ml', emoji: '🥭' },
        { id: 'redbull', name: 'Red Bull Energy', price: 125, unit: '250 ml', emoji: '⚡' },
        { id: 'water-bottle', name: 'Bisleri Water', price: 20, unit: '1 L', emoji: '💧' }
      ]
    },
    {
      id: 'bakery-biscuits',
      name: 'Bakery & Biscuits',
      emoji: '🍞',
      color: '#795548',
      products: [
        { id: 'bread-white', name: 'Britannia White Bread', price: 40, unit: '400 g', emoji: '🍞' },
        { id: 'bread-brown', name: 'Britannia Brown Bread', price: 50, unit: '400 g', emoji: '🍞' },
        { id: 'buns-pav', name: 'Pav Buns', price: 30, unit: '4 pcs', emoji: '🥯' },
        { id: 'croissant', name: 'Butter Croissant', price: 60, unit: '1 pc', emoji: '🥐' },
        { id: 'cake-choco', name: 'Chocolate Cake', price: 250, unit: '500 g', emoji: '🎂' },
        { id: 'rusk', name: 'Britannia Rusk', price: 35, unit: '200 g', emoji: '🍪' },
        { id: 'digestive', name: 'Digestive Biscuits', price: 25, unit: '100 g', emoji: '🍪' }
      ]
    },
    {
      id: 'cleaning',
      name: 'Cleaning Essentials',
      emoji: '🧴',
      color: '#00BCD4',
      products: [
        { id: 'dishwash', name: 'Vim Dishwash Liquid', price: 99, unit: '500 ml', emoji: '🧴' },
        { id: 'detergent', name: 'Surf Excel Quick Wash', price: 135, unit: '1 kg', emoji: '🧼' },
        { id: 'floor-cleaner', name: 'Lizol Floor Cleaner', price: 159, unit: '975 ml', emoji: '🫧' },
        { id: 'handwash', name: 'Dettol Handwash', price: 80, unit: '250 ml', emoji: '🧼' },
        { id: 'tissues', name: 'Kleenex Tissues', price: 85, unit: '130 pulls', emoji: '🧻' },
        { id: 'garbage-bags', name: 'Garbage Bags', price: 50, unit: '20 pcs', emoji: '🗑️' }
      ]
    },
    {
      id: 'meat-fish',
      name: 'Chicken, Meat & Fish',
      emoji: '🍗',
      color: '#F44336',
      products: [
        { id: 'chicken-breast', name: 'Chicken Breast', price: 220, unit: '500 g', emoji: '🍗' },
        { id: 'chicken-curry', name: 'Chicken Curry Cut', price: 180, unit: '500 g', emoji: '🍗' },
        { id: 'mutton', name: 'Mutton Curry Cut', price: 450, unit: '500 g', emoji: '🥩' },
        { id: 'fish-rohu', name: 'Rohu Fish', price: 200, unit: '500 g', emoji: '🐟' },
        { id: 'prawns', name: 'Prawns (Cleaned)', price: 350, unit: '250 g', emoji: '🦐' },
        { id: 'egg-tray', name: 'Eggs (Tray of 30)', price: 260, unit: '30 pcs', emoji: '🥚' }
      ]
    },
    {
      id: 'atta-rice-dal',
      name: 'Atta, Rice & Dal',
      emoji: '🌾',
      color: '#FFC107',
      products: [
        { id: 'atta-aashirvaad', name: 'Aashirvaad Atta', price: 260, unit: '5 kg', emoji: '🌾' },
        { id: 'rice-basmati', name: 'India Gate Basmati Rice', price: 350, unit: '5 kg', emoji: '🍚' },
        { id: 'dal-moong', name: 'Moong Dal', price: 120, unit: '1 kg', emoji: '🫘' },
        { id: 'dal-toor', name: 'Toor Dal', price: 140, unit: '1 kg', emoji: '🫘' },
        { id: 'chana-dal', name: 'Chana Dal', price: 80, unit: '1 kg', emoji: '🫘' },
        { id: 'sugar', name: 'Tata Sugar', price: 55, unit: '1 kg', emoji: '🍬' },
        { id: 'salt', name: 'Tata Salt', price: 25, unit: '1 kg', emoji: '🧂' },
        { id: 'oil-mustard', name: 'Fortune Mustard Oil', price: 180, unit: '1 L', emoji: '🫗' }
      ]
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';
  let quantityMap = {}; // productId → quantity

  /**
   * Get all products across all categories
   */
  function getAllProducts() {
    return CATALOG.flatMap(cat =>
      cat.products.map(p => ({ ...p, category: cat.id, categoryName: cat.name, categoryEmoji: cat.emoji }))
    );
  }

  /**
   * Filter products based on current category and search
   */
  function getFilteredProducts() {
    let products = getAllProducts();

    if (currentCategory !== 'all') {
      products = products.filter(p => p.category === currentCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }

    return products;
  }

  /**
   * Get quantity for a product (default 1)
   */
  function getQty(productId) {
    return quantityMap[productId] || 1;
  }

  /**
   * Set quantity for a product
   */
  function setQty(productId, qty) {
    quantityMap[productId] = Math.max(1, Math.min(99, qty));
  }

  /**
   * Render the full catalog into the container
   */
  function renderCatalog(roomId, userName) {
    const container = document.getElementById('catalogContainer');
    if (!container) return;

    let html = '';

    // Search bar
    html += `
      <div class="catalog-search no-print">
        <div class="input-group">
          <span class="input-group-text"><i class="fas fa-search"></i></span>
          <input type="text" class="form-control" id="catalogSearch"
                 placeholder="Search products..." autocomplete="off">
        </div>
      </div>
    `;

    // Category tabs
    html += '<div class="catalog-tabs no-print">';
    html += `<button class="catalog-tab ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>`;
    CATALOG.forEach(cat => {
      html += `<button class="catalog-tab ${currentCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">${cat.emoji} ${cat.name}</button>`;
    });
    html += '</div>';

    // Product grid
    const products = getFilteredProducts();

    if (products.length === 0) {
      html += `
        <div class="catalog-empty">
          <i class="fas fa-search"></i>
          <p>No products found</p>
        </div>
      `;
    } else {
      html += '<div class="catalog-grid">';
      products.forEach(product => {
        const qty = getQty(product.id);
        html += renderProductCard(product, qty, roomId, userName);
      });
      html += '</div>';
    }

    container.innerHTML = html;
    attachCatalogEvents(roomId, userName);
  }

  /**
   * Render a single product card
   */
  function renderProductCard(product, qty, roomId, userName) {
    const lineTotal = product.price * qty;

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-emoji">${product.emoji}</div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-price">${CartShareUtils.formatCurrency(product.price)} <span class="product-unit">/ ${escapeHtml(product.unit)}</span></div>
        </div>
        <div class="product-footer">
          <div class="qty-selector">
            <button class="qty-btn cat-qty-minus" data-id="${product.id}">−</button>
            <span class="qty-value" data-id="${product.id}">${qty}</span>
            <button class="qty-btn cat-qty-plus" data-id="${product.id}">+</button>
          </div>
          <button class="add-btn cat-add-btn" data-id="${product.id}" data-name="${escapeAttr(product.name)}" data-price="${product.price}" data-unit="${escapeAttr(product.unit)}" data-emoji="${product.emoji}">
            ADD
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to catalog elements
   */
  function attachCatalogEvents(roomId, userName) {
    // Category tabs
    document.querySelectorAll('.catalog-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentCategory = tab.dataset.cat;
        renderCatalog(roomId, userName);
      });
    });

    // Search input
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
      searchInput.value = searchQuery;
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCatalog(roomId, userName);
        // Re-focus and restore cursor position
        const newInput = document.getElementById('catalogSearch');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      });
    }

    // Quantity minus buttons
    document.querySelectorAll('.cat-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const current = getQty(id);
        if (current > 1) {
          setQty(id, current - 1);
          renderCatalog(roomId, userName);
        }
      });
    });

    // Quantity plus buttons
    document.querySelectorAll('.cat-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        setQty(id, getQty(id) + 1);
        renderCatalog(roomId, userName);
      });
    });

    // Add to cart buttons
    document.querySelectorAll('.cat-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const qty = getQty(id);

        // Add to cart
        const result = CartShareCart.addItem(roomId, {
          name: name,
          price: price,
          quantity: qty
        }, userName);

        if (result) {
          // Visual feedback — briefly change button to "Added!"
          const card = btn.closest('.product-card');
          if (card) {
            card.classList.add('product-added');
            btn.textContent = '✓ ADDED';
            btn.classList.add('added');
            setTimeout(() => {
              card.classList.remove('product-added');
              btn.textContent = 'ADD';
              btn.classList.remove('added');
            }, 1200);
          }

          // Reset quantity to 1
          setQty(id, 1);
          renderCatalog(roomId, userName);
        }
      });
    });
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;');
  }

  return {
    renderCatalog,
    CATALOG
  };
})();
