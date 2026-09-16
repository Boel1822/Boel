const products = [
  { id: 1, name: "Cloud Dew Serum", type: "Hydrating serum", price: 189000, tag: "Best seller", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Mellow Cleanse", type: "Gentle cleansing gel", price: 149000, tag: "New", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Soft Focus Cream", type: "Barrier moisturizer", price: 179000, tag: "Favorite", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "Sunday Shield", type: "Daily sunscreen SPF 35", price: 159000, tag: "Everyday", image: "https://images.unsplash.com/photo-1556229010-aa3d6d8d7f8b?auto=format&fit=crop&w=700&q=85" }
];
let cart = [];
const formatPrice = (value) => `Rp ${value.toLocaleString("id-ID")}`;
const grid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector(".cart-drawer");
const overlay = document.querySelector(".overlay");
function renderProducts() {
  grid.innerHTML = products.map((product) => `<article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" /><span class="product-tag">${product.tag}</span></div><div class="product-info"><h3>${product.name}</h3><p>${product.type}</p><div class="product-row"><span class="price">${formatPrice(product.price)}</span><button class="add-button" data-id="${product.id}">Add to cart +</button></div></div></article>`).join("");
  document.querySelectorAll(".add-button").forEach((button) => button.addEventListener("click", () => addToCart(Number(button.dataset.id))));
}
function renderCart() {
  const items = document.querySelector(".cart-items");
  const empty = document.querySelector(".cart-empty");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector(".cart-count").textContent = count;
  document.querySelector(".cart-total").textContent = formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  empty.style.display = cart.length ? "none" : "block";
  items.innerHTML = cart.map((item) => `<div class="cart-item"><img src="${item.image}" alt="${item.name}" /><div class="cart-item-info"><strong>${item.name}</strong><p>${item.quantity} × ${formatPrice(item.price)}</p><button class="remove-item" data-id="${item.id}">Remove</button></div></div>`).join("");
  items.querySelectorAll(".remove-item").forEach((button) => button.addEventListener("click", () => { cart = cart.filter((item) => item.id !== Number(button.dataset.id)); renderCart(); }));
}
function addToCart(id) { const product = products.find((item) => item.id === id); const existing = cart.find((item) => item.id === id); existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 }); renderCart(); openCart(); }
function openCart() { cartDrawer.classList.add("open"); overlay.classList.add("show"); cartDrawer.setAttribute("aria-hidden", "false"); }
function closeCart() { cartDrawer.classList.remove("open"); overlay.classList.remove("show"); cartDrawer.setAttribute("aria-hidden", "true"); }
document.querySelector(".cart-button").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.querySelector(".menu-toggle").addEventListener("click", (event) => { const menu = document.querySelector(".nav-links"); const expanded = event.currentTarget.getAttribute("aria-expanded") === "true"; event.currentTarget.setAttribute("aria-expanded", String(!expanded)); menu.classList.toggle("open"); });
document.querySelector(".newsletter-form").addEventListener("submit", (event) => { event.preventDefault(); event.currentTarget.innerHTML = "<p class=\"eyebrow\">Thank you ✦</p><p>Kamu sudah masuk dalam ritual kami.</p>"; });
renderProducts();
renderCart();
