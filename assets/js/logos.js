document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.classList.add("floating-logos");
  document.body.appendChild(container);

  const logos = ["python.svg", "java.svg", "vscode.svg", "github.svg", "js.svg"];

  logos.forEach((logo, i) => {
    const img = document.createElement("img");
    img.src = `assets/img/${logo}`;
    img.classList.add("floating-logo");
    img.style.top = `${Math.random() * 80 + 10}%`;
    img.style.left = `${Math.random() * 80 + 10}%`;
    img.style.animationDelay = `${i * 2}s`;
    container.appendChild(img);
  });
});
