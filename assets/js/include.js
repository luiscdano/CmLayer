// Detectar la ruta base correctamente
const basePath = window.location.pathname.includes("/") ? "." : "";

// Insertar header
fetch(`${basePath}/header.html`)
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;

    // Después del header, insertar el fondo flotante si no existe
    if (!document.querySelector(".floating-logos")) {
      const logosDiv = document.createElement("div");
      logosDiv.classList.add("floating-logos");
      document.body.appendChild(logosDiv);
    }
  });

// Insertar footer
fetch(`${basePath}/footer.html`)
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;
  });
