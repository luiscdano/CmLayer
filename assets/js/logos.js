// === CONFIGURACIÓN DE LOGOS ===
const logos = [
  "/assets/img/python.svg",
  "/assets/img/java.svg",
  "/assets/img/js.svg",
  "/assets/img/vscode.svg",
  "/assets/img/github.svg"
];

// Cantidad total de logos flotantes
const LOGO_COUNT = 20;

// Área protegida (para que no pasen sobre títulos)
const PROTECTED_AREA_HEIGHT = 250; // pixeles desde el top

// Crear logos
function createFloatingLogos() {
  const container = document.body;

  for (let i = 0; i < LOGO_COUNT; i++) {
    const img = document.createElement("img");
    img.src = logos[i % logos.length];
    img.className = "floating-logo";

    // Posición inicial aleatoria
    let x = Math.random() * window.innerWidth;
    let y = PROTECTED_AREA_HEIGHT + Math.random() * (window.innerHeight - PROTECTED_AREA_HEIGHT - 150);

    // Dirección aleatoria
    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    container.appendChild(img);

    // Movimiento suave
    function animate() {
      x += dx;
      y += dy;

      if (x < 0 || x > window.innerWidth - 40) dx *= -1;
      if (y < PROTECTED_AREA_HEIGHT || y > window.innerHeight - 40) dy *= -1;

      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      requestAnimationFrame(animate);
    }

    animate();
  }
}

// Ejecutar al cargar
window.addEventListener("load", createFloatingLogos);
