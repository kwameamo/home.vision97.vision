/**
 * Vision'97 Main JavaScript
 * Handles animations and menu interactions
 */

// Check for CSS Variables support
document.documentElement.className = "js";
var supportsCssVars = function() {
  var e, t = document.createElement("style");
  return t.innerHTML = "root: { --tmp-var: bold; }",
  document.head.appendChild(t),
  e = !!(window.CSS && window.CSS.supports && window.CSS.supports("font-weight", "var(--tmp-var)")),
  t.parentNode.removeChild(t), e
};

// Show warning for browsers that don't support CSS variables
if (!supportsCssVars()) {
  alert("Please view this website in a modern browser that supports CSS Variables.");
}

// Main initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fade in the body after a short delay
  setTimeout(() => document.body.classList.add('render'), 60);
  
  // Menu items animation effect
  initMenuAnimations();
});

/**
 * Initialize menu item hover animations
 */
function initMenuAnimations() {
  const menuItems = document.querySelectorAll('.menu__item');
  
  menuItems.forEach(item => {
    // Get the label element for this menu item
    const label = item.querySelector('.menu__item-label');
    
    // Handle mouseenter event
    item.addEventListener('mouseenter', () => {
      // Fade out then in for a nice effect
      label.style.opacity = 0;
      setTimeout(() => {
        label.style.opacity = 1;
        label.style.transition = 'opacity 0.3s';
      }, 50);
    });
    
    // Handle mouseleave event
    item.addEventListener('mouseleave', () => {
      label.style.transition = '';
    });
  });
}