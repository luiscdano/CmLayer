const logos = ["python.svg", "java.svg", "js.svg", "vscode.svg", "github.svg"];

const container = document.createElement("div");
container.id = "floating-logos";
document.body.appendChild(container);

logos.forEach((logo, i) => {
  const img = document.createElement("img");
  img.src = `assets/img/${logo}`;

  img.style.top = `${10 + i * 15}%`;
  img.style.left = `${10 + (i * 15)}%`;
  img.style.animationDelay = `${i * 1.2}s`;

  container.appendChild(img);
});
