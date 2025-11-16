const logos = [
  "assets/img/python.svg",
  "assets/img/js.svg",
  "assets/img/vscode.svg",
  "assets/img/github.svg"
];

const container = document.querySelector(".floating-logos");

// Generar 30 logos distribuidos al azar
for (let i = 0; i < 30; i++) {
    const img = document.createElement("img");
    img.src = logos[Math.floor(Math.random() * logos.length)];

    img.style.top = Math.random() * 100 + "%";
    img.style.left = Math.random() * 100 + "%";
    img.style.animationDuration = 10 + Math.random() * 20 + "s";

    container.appendChild(img);
}
