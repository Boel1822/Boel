const WA_PHONE = "6281928636439";

const buyModal = document.getElementById("buy-modal");
const modalProductName = document.getElementById("modal-product-name");
const modalProductPrice = document.getElementById("modal-product-price");
const modalWaBtn = document.getElementById("modal-wa-btn");

function openBuyModal(productName, productPrice) {
  modalProductName.textContent = productName;
  modalProductPrice.textContent = productPrice;
  const message = `Halo Nalvost Beauty, saya ingin memesan ${productName} (${productPrice}). Apakah masih tersedia?`;
  modalWaBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  buyModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeBuyModal() {
  buyModal.classList.add("hidden");
  document.body.style.overflow = "";
}

buyModal.addEventListener("click", (event) => {
  if (event.target === buyModal) closeBuyModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !buyModal.classList.contains("hidden")) closeBuyModal();
});

(function initSnow() {
  const canvas = document.getElementById("snow-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, flakes;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createFlakes(count) {
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#7dd3fc";
    for (const flake of flakes) {
      ctx.globalAlpha = flake.opacity;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function update() {
    for (const flake of flakes) {
      flake.y += flake.speedY;
      flake.x += flake.speedX;
      if (flake.y > height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * width;
      }
      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  createFlakes(Math.min(80, Math.floor((width * height) / 18000)));
  draw();

  if (!prefersReducedMotion) requestAnimationFrame(loop);

  window.addEventListener("resize", () => {
    resize();
    createFlakes(Math.min(80, Math.floor((width * height) / 18000)));
  });
})();
