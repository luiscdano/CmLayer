// Detecta si estamos dentro de una carpeta
const basePath = window.location.pathname.includes("/") &&
                 window.location.pathname.split("/").length > 2
                 ? "../"
                 : "./";

// Insertar Header
fetch(basePath + "header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
  });

// Insertar Footer
fetch(basePath + "footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;
  });
