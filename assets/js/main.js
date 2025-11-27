// main.js — small client-side utilities for the demo site
(function () {
  const DATA_PATH = "assets/data/products.json";

  async function fetchProducts() {
    const res = await fetch(DATA_PATH);
    return res.ok ? res.json() : [];
  }

  // Utilities
  function qs(sel) {
    return document.querySelector(sel);
  }
  function qsa(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  // PRODUCTS LISTING PAGE
  async function initProductsPage() {
    const grid = qs("#productGrid");
    if (!grid) return;
    const products = await fetchProducts();
    const categories = [
      "all",
      ...Array.from(new Set(products.map((p) => p.category))),
    ];
    const catSelect = qs("#categoryFilter");
    categories.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      catSelect.appendChild(opt);
    });

    let filtered = products.slice();
    let page = 1,
      perPage = 9;

    function render() {
      const start = (page - 1) * perPage;
      const pageItems = filtered.slice(start, start + perPage);
      grid.innerHTML = pageItems
        .map(
          (p) => `
        <article class="bg-white rounded shadow p-4 product-card">
          <h3 class="font-semibold">${p.name}</h3>
          <p class="text-sm text-gray-600">Category: ${p.category}</p>
          <p class="mt-2 font-bold">$${p.price.toFixed(2)}</p>
          <p class="text-sm text-gray-500">Stock: ${p.stock}</p>
          <div class="mt-3">
            <a class="inline-block bg-blue-600 text-white px-3 py-1 rounded" href="product.html?id=${
              p.id
            }">View</a>
          </div>
        </article>
      `
        )
        .join("");
      qs("#pageInfo").textContent = `Page ${page} of ${Math.max(
        1,
        Math.ceil(filtered.length / perPage)
      )}`;
      qs("#prevPage").disabled = page <= 1;
      qs("#nextPage").disabled = page >= Math.ceil(filtered.length / perPage);
    }

    function applyFilters() {
      const cat = qs("#categoryFilter").value;
      const search = qs("#searchInput").value.trim().toLowerCase();
      const sort = qs("#sortSelect").value;
      filtered = products.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (search === "" ||
            (p.name + " " + p.category).toLowerCase().includes(search))
      );
      if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
      page = 1;
      render();
    }

    qs("#categoryFilter").addEventListener("change", applyFilters);
    qs("#sortSelect").addEventListener("change", applyFilters);
    qs("#searchInput").addEventListener("input", () => {
      setTimeout(applyFilters, 150);
    });
    qs("#prevPage").addEventListener("click", () => {
      page = Math.max(1, page - 1);
      render();
    });
    qs("#nextPage").addEventListener("click", () => {
      page++;
      render();
    });

    applyFilters();
  }

  // PRODUCT DETAIL PAGE
  async function initProductPage() {
    const container = qs("#productDetail");
    if (!container) return;
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id")) || null;
    if (!id) {
      container.innerHTML =
        '<p class="text-red-600">No product id provided.</p>';
      return;
    }
    const products = await fetchProducts();
    const p = products.find((x) => x.id === id);
    if (!p) {
      container.innerHTML = '<p class="text-red-600">Product not found.</p>';
      return;
    }
    const revenue = p.price * p.stock;
    container.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1 bg-gray-100 rounded p-6">
          <h1 class="text-2xl font-bold mb-2">${p.name}</h1>
          <p class="text-sm text-gray-600">Category: ${p.category}</p>
          <p class="mt-4 text-xl font-semibold">$${p.price.toFixed(2)}</p>
          <p class="text-sm text-gray-500">Stock: ${p.stock}</p>
        </div>
        <div class="w-full md:w-64 bg-white rounded p-6 shadow">
          <h3 class="font-semibold">Revenue</h3>
          <p class="mt-2 text-lg font-bold">$${revenue.toLocaleString()}</p>
          <a href="products.html" class="mt-4 inline-block bg-blue-600 text-white px-3 py-1 rounded">Back to Products</a>
        </div>
      </div>
    `;
  }

  // CONTACT PAGE
  function initContactPage() {
    const form = qs("#contactForm");
    if (!form) return;
    const payloadEl = qs("#payload");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const body = {
        name: qs("#name").value,
        email: qs("#email").value,
        message: qs("#message").value,
      };
      payloadEl.textContent = JSON.stringify(body, null, 2);
    });
    const webhookBtn = qs("#sendWebhook");
    webhookBtn.addEventListener("click", async () => {
      const text = payloadEl.textContent || "{}";
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        alert("No payload to send");
        return;
      }
      // default demo webhook — replace as needed
      const webhookUrl =
        "https://webhook.site/96d61ca9-4e67-4fad-9101-bee933d6f26b";
      try {
        const r = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });
        if (r.ok) alert("Payload sent (demo webhook).");
        else alert("Failed to send payload.");
      } catch (e) {
        alert("Network error sending webhook.");
      }
    });
  }

  // Bootstrap by detecting page elements
  document.addEventListener("DOMContentLoaded", () => {
    initProductsPage();
    initProductPage();
    initContactPage();
  });
})();
