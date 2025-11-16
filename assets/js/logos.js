cat > assets/js/logos.js <<'EOF'
/*
  logos.js — genera un mosaico de logos dispersos evitando el área central
  y aplica parallax suave al hacer scroll.
  Funciona desde root y desde subcarpetas (detecta basePath).
*/

(function(){
  // Detect base path so it works in / and /Cognition/ (GitHub Pages)
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  // if served from user.github.io/RepoName -> first part is repo name -> need leading ../ for pages in subfolders
  // Approach: compute base to reach project root (where assets/ lives)
  let basePath = "./";
  if(pathParts.length >= 2){
    // examples: ['CmLayer'] OR ['CmLayer','Cognition']
    // if first part equals repo name, and we're in subfolder, go up accordingly
    // We try to find a parent path that contains 'assets' by testing fetch of a small file could be heavy,
    // but to be simple: if length>1, set basePath = '../' repeated (length-1) times
    basePath = "../".repeat(pathParts.length - 1);
  }

  // list of logo files (relative to project root)
  const logos = [
    basePath + "assets/img/python.svg",
    basePath + "assets/img/js.svg",
    basePath + "assets/img/vscode.svg",
    basePath + "assets/img/github.svg",
    basePath + "assets/img/java.svg"
  ];

  // create container if not present
  let container = document.querySelector(".floating-logos");
  if(!container){
    container = document.createElement("div");
    container.className = "floating-logos";
    document.body.appendChild(container);
  }

  // number of logos depends on viewport width
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const count = vw > 1200 ? 36 : vw > 900 ? 28 : vw > 600 ? 20 : 10;

  // helper: avoid placing logos inside central "content" area (center 56% width, 50% height)
  function isInCenter(xPct, yPct){
    const centerX = 50, centerY = 45;
    const w = 56, h = 50; // percentage extents to avoid
    return (xPct > (centerX - w/2) && xPct < (centerX + w/2) && yPct > (centerY - h/2) && yPct < (centerY + h/2));
  }

  // seed random but stable per page load
  for(let i=0;i<count;i++){
    const img = document.createElement("img");
    img.decoding = "async";
    img.loading = "lazy";
    img.src = logos[Math.floor(Math.random()*logos.length)];
    img.setAttribute("aria-hidden","true");

    // choose a position outside center
    let x, y, tries=0;
    do{
      x = Math.random()*100;
      y = Math.random()*100;
      tries++;
      if(tries>80) break;
    } while(isInCenter(x,y));

    img.style.left = `${x}%`;
    img.style.top = `${y}%`;

    // size variation
    const size = (Math.random()*28) + (vw > 900 ? 36 : 20); // px base
    img.style.width = `${Math.round(size)}px`;

    // gentle animation duration and delay
    const dur = 8 + Math.random()*12;
    img.style.animationDuration = dur + "s";
    img.style.transitionDuration = (0.6 + Math.random()*0.8) + "s";

    // parallax depth 0.2..1.0
    img.dataset.parallax = (0.2 + Math.random()*0.8).toFixed(2);

    // slight rotation
    const rot = (Math.random()*40) - 20;
    img.style.transform = `translate3d(0,0,0) rotate(${rot}deg)`;

    container.appendChild(img);
  }

  // Parallax scroll handler (throttled)
  let lastScrollY = window.scrollY;
  let ticking = false;
  function onScroll(){
    lastScrollY = window.scrollY;
    if(!ticking){
      window.requestAnimationFrame(()=> {
        const images = container.querySelectorAll("img[data-parallax]");
        images.forEach(img => {
          const depth = parseFloat(img.dataset.parallax);
          // move opposite to scroll for parallax (small amount)
          const offset = (lastScrollY * depth * 0.02);
          img.style.transform = `translateY(${offset}px) rotate(${(Math.random()*10-5).toFixed(1)}deg)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, {passive:true});

  // Recompute on resize (reduce count for small screens)
  window.addEventListener("resize", ()=> {
    // simple approach: if viewport class changed significantly we can reload page to regenerate mosaic,
    // but to keep it simple we won't reconstruct automatically here.
  });

})();
EOF
