const logos = [
    "python.svg",
    "js.svg",
    "vscode.svg",
    "github.svg",
    "java.svg"
];

const TOTAL_LOGOS = 25;  // ajusta si quieres más o menos

function createFloatingLogo() {
    const img = document.createElement("img");
    img.src = `assets/img/${logos[Math.floor(Math.random() * logos.length)]}`;
    img.classList.add("floating-logo");

    // Posición aleatoria inicial
    img.style.top = Math.random() * 3000 + "px";
    img.style.left = Math.random() * window.innerWidth + "px";

    // Velocidad diferente por logo
    img.style.animationDuration = (18 + Math.random() * 14) + "s";

    document.body.appendChild(img);
}

for (let i = 0; i < TOTAL_LOGOS; i++) {
    createFloatingLogo();
}
