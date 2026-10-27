// Service worker de EQUINOS: guarda la app en el dispositivo para abrirla sin señal.
// Cada vez que se sube una versión nueva, cambiar el número de CACHE (la app avisa "Hay una versión nueva").
const CACHE = "equinos-v2026.10.27-b";
const ARCHIVOS = ["./", "./Equinos.html", "./manifest.json", "./icon-180.png", "./icon-192.png", "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    for (const a of ARCHIVOS) { try { await c.add(new Request(a, { cache: "reload" })); } catch (err) {} }
    // Los módulos de Firebase importan otros archivos: se guardan a medida que se piden (ver fetch).
  })());
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => { const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))); await self.clients.claim(); })());
});
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La base de datos (firebaseio / websocket) nunca se cachea.
  if (url.hostname.endsWith("firebaseio.com") || url.hostname.endsWith("googleapis.com")) return;
  const esApp = url.origin === self.location.origin;
  const esLib = url.hostname === "www.gstatic.com" || url.hostname === "cdnjs.cloudflare.com" || url.hostname === "cdn.jsdelivr.net";
  if (!esApp && !esLib) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (esApp && (url.pathname.endsWith("/") || url.pathname.endsWith("Equinos.html"))) {
      // La app: primero red (para recibir versiones nuevas), si no hay señal, la copia guardada.
      try { const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; } catch (err) { return (await c.match(req)) || (await c.match("./Equinos.html")); }
    }
    // Librerías e íconos: primero lo guardado, si no está se baja y se guarda.
    const hit = await c.match(req); if (hit) return hit;
    try { const r = await fetch(req); if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; } catch (err) { return hit || Response.error(); }
  })());
});
