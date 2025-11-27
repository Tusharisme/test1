Demo Store — Static Multipage Demo

This workspace contains a small static multipage demo site.

Files added:

- `index.html` — Home page
- `products.html` — Product catalogue (client-side rendering)
- `product.html` — Product details (query param `id`)
- `about.html`, `contact.html` — informational pages
- `assets/data/products.json` — product dataset
- `assets/js/main.js` — client-side logic (filtering, pagination, product detail)

To preview locally you can run a simple static server. Examples:

PowerShell (Windows):

```pwsh
# From the repository root
python -m http.server 8000
# then open http://localhost:8000/
```

Or with Node (if you have http-server):

```pwsh
npm install -g http-server
http-server -p 8000
# then open http://localhost:8000/
```

Notes:

- The contact form shows the JSON payload in the UI and can POST to the demo webhook configured in `main.js`.
- The product dataset is embedded in `assets/data/products.json` and used by the pages.

Next steps I can help with:

- Add images & thumbnails for products
- Add a small build step (Vite) or Tailwind CLI for production-ready CSS
- Add a serverless function for contact form delivery
