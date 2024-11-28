// Shopping Cart Implementation
const shoppingCart = [];
const productList = [
  { id: 1, name: "Apple", price: 0.5, image: "https://via.placeholder.com/80?text=Apple" },
  { id: 2, name: "Banana", price: 0.2, image: "https://via.placeholder.com/80?text=Banana" },
  { id: 3, name: "Orange", price: 0.7, image: "https://via.placeholder.com/80?text=Orange" }
];

// Fallback image
const fallbackImage = "https://via.placeholder.com/80?text=No+Image";

// Load an image with a Promise
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(fallbackImage);
    img.src = src;
  });
};

// Render products dynamically after images are loaded
const renderProducts = async () => {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; // Clear loading message

  for (const product of productList) {
    try {
      const imageSrc = await loadImage(product.image);
      const productEl = document.createElement("div");
      productEl.className = "product";
      productEl.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}">
        <div class="product-details">
          <h3>${product.name}</h3>
          <p>Price: $${product.price.toFixed(2)}</p>
        </div>
        <button class="btn" onclick="addItem(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
      `;
      productsContainer.appendChild(productEl);
    } catch (error) {
      console.error("Image loading failed:", error);
    }
  }
};

// Add item to cart
const addItem = (id, name, price, quantity = 1) => {
  const existingItem = shoppingCart.find(item => item.id === id);

  existingItem
    ? existingItem.quantity += quantity // Update quantity if item exists
    : shoppingCart.push({ id, name, price, quantity }); // Add new item

  renderCart();
};

// Calculate total price
const calculateTotal = () =>
  shoppingCart.reduce((total, item) => total + item.price * item.quantity, 0);

// Render cart items to HTML
const renderCart = () => {
  const cartItemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('total');

  // Clear cart content
  cartItemsEl.innerHTML = '';

  // Add each item to the cart
  shoppingCart.forEach(({ id, name, price, quantity }) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div>${name} - $${price.toFixed(2)}</div>
      <div class="quantity-container">
        <button class="btn" onclick="updateQuantity(${id}, 'decrease')">-</button>
        <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${id}, 'change', this.value)" />
        <button class="btn" onclick="updateQuantity(${id}, 'increase')">+</button>
      </div>
      <button class="btn" onclick="removeItem(${id})">Remove</button>
    `;
    cartItemsEl.appendChild(listItem);
  });

  // Update total
  totalEl.textContent = calculateTotal().toFixed(2);
};

// Update quantity in cart
const updateQuantity = (id, action, value) => {
  const item = shoppingCart.find(item => item.id === id);

  if (action === 'decrease' && item.quantity > 1) {
    item.quantity--;
  } else if (action === 'increase') {
    item.quantity++;
  } else if (action === 'change') {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1) item.quantity = newQuantity;
  }

  renderCart();
};

// Remove item from cart
const removeItem = id => {
  const index = shoppingCart.findIndex(item => item.id === id);
  if (index !== -1) shoppingCart.splice(index, 1);

  renderCart();
};

// Load and render products on page load
renderProducts();
