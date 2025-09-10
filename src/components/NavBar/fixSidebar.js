// This small script ensures the menu button is visible on mobile devices
// It can be included at the end of NavBar2.jsx or as a separate script that's loaded on the page

function checkMenuButtonVisibility() {
  const menuButton = document.querySelector('.menuButton');
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile && menuButton) {
    menuButton.style.display = 'flex';
  }
}

// Run on load and on window resize
window.addEventListener('load', checkMenuButtonVisibility);
window.addEventListener('resize', checkMenuButtonVisibility);

// Run every second for the first 10 seconds to ensure it catches any delayed rendering
let count = 0;
const interval = setInterval(() => {
  checkMenuButtonVisibility();
  count++;
  if (count >= 10) clearInterval(interval);
}, 1000);
