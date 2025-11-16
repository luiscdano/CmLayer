/* ============================
   Header + Footer dinámicos
============================ */
function resolve(path) {
  const depth = window.location.pathname.split("/").length - 2;
  return depth === 0 ? path : "../".repeat(depth) + path;
}

// Insert header
fetch(resolve("header.html"))
  .then(r => r.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
  });

// Insert footer
fetch(resolve("footer.html"))
  .then(r => r.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;

    // 📌 Inyectar logos.js automáticamente en TODAS las páginas
    const s = document.createElement("script");
    s.src = resolve("assets/js/logos.js");
    document.body.appendChild(s);
  });
