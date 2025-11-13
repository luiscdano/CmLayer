// layout.js — inserta header y footer desde template.html
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/template.html");
    const template = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(template, "text/html");
    const header = doc.querySelector("header");
    const footer = doc.querySelector("footer");

    document.body.insertBefore(header, document.body.firstChild);
    document.body.appendChild(footer);
  } catch (error) {
    console.error("Error al cargar layout:", error);
  }
});
