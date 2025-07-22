// Helper: Get unique categories from products
function getUniqueCategories() {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
}

// Display products on index.html
if (document.getElementById("products")) {
  function displayProducts(list) {
    const container = document.getElementById("products");
    container.innerHTML = "";
    list.forEach(p => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${p.name}</h3>
        <p>Price: ₹${p.price}</p>
        <p>Rating: ${p.rating}</p>
        <a href="product.html?id=${p.id}">View</a>`;
      container.appendChild(div);
    });
  }

  // Dynamic category filter
  const catSelect = document.getElementById("categoryFilter");
  catSelect.innerHTML = '<option value="">All Categories</option>';
  getUniqueCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    catSelect.appendChild(opt);
  });

  document.getElementById("search").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const category = catSelect.value;
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(keyword) &&
      (category === "" || p.category === category)
    );
    displayProducts(filtered);
  });

  catSelect.addEventListener("change", () => {
    const keyword = document.getElementById("search").value.toLowerCase();
    const category = catSelect.value;
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(keyword) &&
      (category === "" || p.category === category)
    );
    displayProducts(filtered);
  });

  displayProducts(products);
}

// Toggle Cart Panel
function toggleCart() {
  const panel = document.getElementById("cartPanel");
  const btn = document.getElementById("showCartBtn");
  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    renderCartItems();
    btn.textContent = "🛒 Hide Cart";
  } else {
    panel.style.display = "none";
    btn.textContent = "🛒 Show Cart";
  }
}

// Render Cart Items
function renderCartItems() {
  const cartContainer = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  if (!cartContainer || !totalEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "Total: ₹0";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${quantity}</p>
      <p>Subtotal: ₹${itemTotal}</p>
    `;
    cartContainer.appendChild(div);
  });

  totalEl.textContent = `Total: ₹${total}`;
}

function checkout() {
  alert("Thank you for your order! This is a mock checkout.");
  localStorage.removeItem("cart");
  renderCartItems();
  document.getElementById("cartPanel").style.display = "none";
  document.getElementById("showCartBtn").textContent = "🛒 Show Cart";
}

// Product Detail Page Logic
if (window.location.href.includes("product.html")) {
  const id = new URLSearchParams(location.search).get("id");
  const product = products.find(p => p.id == id);
  if (product) {
    document.getElementById("productDetail").innerHTML =
      `<h2>${product.name}</h2><p>₹${product.price}</p><p>Rating: ${product.rating}</p>`;
  }

  window.addToCart = function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };
}

// Admin Dashboard Logic
if (document.getElementById("adminProducts")) {
  let adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

  function renderAdminList() {
    const ul = document.getElementById("adminProducts");
    ul.innerHTML = "";
    adminProducts.forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${p.name} - ₹${p.price} 
        <button onclick="edit(${i})">Edit</button> 
        <button onclick="del(${i})">Delete</button>`;
      ul.appendChild(li);
    });
  }

  window.createProduct = function () {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const rating = parseInt(document.getElementById("rating").value);
    adminProducts.push({ name, category, price, rating });
    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));
    renderAdminList();
  };

  window.del = function (i) {
    adminProducts.splice(i, 1);
    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));
    renderAdminList();
  };

  window.edit = function (i) {
    const p = adminProducts[i];
    document.getElementById("name").value = p.name;
    document.getElementById("category").value = p.category;
    document.getElementById("price").value = p.price;
    document.getElementById("rating").value = p.rating;
    del(i);
  };

  renderAdminList();
}
