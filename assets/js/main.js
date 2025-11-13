document.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.body.style.backgroundPositionY = `${scrollY * 0.3}px`;
});
