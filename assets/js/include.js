// Insert header
fetch("/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
  });

// Insert footer
fetch("/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;
  });
