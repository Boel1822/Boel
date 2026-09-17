const CART_STORAGE_KEY = "nalvost_cart";
const WA_PHONE_NUMBER = "6281928636439";
const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(id, name, price) {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  renderCartUI();
  openCartDrawer();
}

function updateCartQty(id, delta) {
  const cart = loadCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  const nextCart = item.qty <= 0 ? cart.filter((entry) => entry.id !== id) : cart;
  saveCart(nextCart);
  renderCartUI();
}

function removeFromCart(id) {
  saveCart(loadCart().filter((item) => item.id !== id));
  renderCartUI();
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCartUI() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cart-badge, #cart-badge-mobile").forEach((badge) => {
    badge.textContent = String(count);
    badge.classList.toggle("hidden", count === 0);
  });

  const itemsWrap = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty-msg");
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (!itemsWrap) return;

  emptyMsg.classList.toggle("hidden", cart.length > 0);
  checkoutBtn.disabled = cart.length === 0;

  itemsWrap.innerHTML = cart
    .map(
      (item) => `
    <div class="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-200">
      <div class="flex-1 pr-2">
        <p class="text-xs font-bold text-slate-800">${item.name}</p>
        <p class="text-[11px] text-sky-700 font-semibold mt-0.5">${formatRupiah(item.price)}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 text-xs flex items-center justify-center">-</button>
        <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
        <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 text-xs flex items-center justify-center">+</button>
        <button onclick="removeFromCart('${item.id}')" class="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 text-rose-500 text-xs flex items-center justify-center ml-1">
          <i class="fa-solid fa-trash text-[10px]"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  document.getElementById("cart-total").textContent = formatRupiah(cartTotal(cart));
}

function openCartDrawer() {
  renderCartUI();
  document.getElementById("cart-drawer").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cart-drawer").classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("cart-drawer").addEventListener("click", (event) => {
  if (event.target === document.getElementById("cart-drawer")) closeCartDrawer();
});

function startCheckout() {
  const cart = loadCart();
  if (cart.length === 0) return;

  if (!firebase.auth().currentUser) {
    closeCartDrawer();
    openAuthModal(true);
    return;
  }

  closeCartDrawer();
  const itemsWrap = document.getElementById("checkout-items");
  itemsWrap.innerHTML = cart
    .map(
      (item) => `
    <div class="flex items-center justify-between">
      <span>${item.name} × ${item.qty}</span>
      <span class="font-semibold text-slate-800">${formatRupiah(item.price * item.qty)}</span>
    </div>
  `
    )
    .join("");
  document.getElementById("checkout-total").textContent = formatRupiah(cartTotal(cart));
  document.getElementById("checkout-error").classList.add("hidden");
  document.getElementById("checkout-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("checkout-modal").addEventListener("click", (event) => {
  if (event.target === document.getElementById("checkout-modal")) closeCheckoutModal();
});

function confirmCheckoutViaWhatsApp() {
  const cart = loadCart();
  const name = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const address = document.getElementById("checkout-address").value.trim();
  const errorEl = document.getElementById("checkout-error");

  if (!name || !phone || !address) {
    errorEl.textContent = "Mohon lengkapi nama, no. WhatsApp, dan alamat pengiriman.";
    errorEl.classList.remove("hidden");
    return;
  }
  if (cart.length === 0) {
    errorEl.textContent = "Keranjang kosong.";
    errorEl.classList.remove("hidden");
    return;
  }

  const user = firebase.auth().currentUser;
  const itemLines = cart.map((item) => `- ${item.name} x${item.qty} = ${formatRupiah(item.price * item.qty)}`).join("\n");
  const total = formatRupiah(cartTotal(cart));
  const message = [
    "Halo Nalvost Beauty, saya ingin konfirmasi pesanan & pembayaran QRIS:",
    "",
    itemLines,
    `Total: ${total}`,
    "",
    `Nama: ${name}`,
    `No. WA: ${phone}`,
    `Alamat: ${address}`,
    user ? `Email akun: ${user.email}` : "",
    "",
    "Bukti transfer QRIS akan saya kirimkan menyusul di chat ini.",
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

  saveCart([]);
  renderCartUI();
  closeCheckoutModal();
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!document.getElementById("checkout-modal").classList.contains("hidden")) closeCheckoutModal();
  else if (!document.getElementById("cart-drawer").classList.contains("hidden")) closeCartDrawer();
  else if (!document.getElementById("auth-modal").classList.contains("hidden")) closeAuthModal();
});

renderCartUI();
