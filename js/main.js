/**
 * Vision'97 Main JavaScript
 * Replicating the original site's interactions
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

/**
 * Simple function to split text into individual characters
 * This replaces the functionality of charming.js from the original
 */
function charming(element) {
  const text = element.textContent.trim();
  element.innerHTML = '';
  
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    // Handle spaces specially
    if (text[i] === ' ') {
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = text[i];
    }
    span.style.opacity = 1;
    element.appendChild(span);
  }
  
  return Array.from(element.querySelectorAll('span'));
}

/**
 * Function to animate elements with staggered timing
 * This replicates the basic functionality of anime.js from the original
 */
function animateElements(elements, options) {
  const defaults = {
    duration: 1000,
    delay: 0,
    easing: 'linear',
    opacity: [0, 1]
  };
  
  const settings = {...defaults, ...options};
  
  elements.forEach((el, i) => {
    // Calculate delay based on index if a function is provided
    let itemDelay = typeof settings.delay === 'function' 
      ? settings.delay(el, i)
      : settings.delay;
    
    // Reset element to initial state
    el.style.opacity = settings.opacity[0];
    
    // Apply animation with delay
    setTimeout(() => {
      el.style.transition = `opacity ${settings.duration}ms ${settings.easing}`;
      el.style.opacity = settings.opacity[1];
      
      // Reset transition after animation completes
      setTimeout(() => {
        el.style.transition = '';
      }, settings.duration);
      
    }, itemDelay);
  });
}

// Main initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fade in the body after a short delay
  setTimeout(() => document.body.classList.add('render'), 60);
  
  // Handle demo navigation (from original demo.js)
  const navdemos = Array.from(document.querySelectorAll('nav.demos > .demo'));
  if (navdemos.length > 0) {
    const total = navdemos.length;
    const current = navdemos.findIndex(el => el.classList.contains('demo--current'));
    
    const navigate = (linkEl) => {
      document.body.classList.remove('render');
      document.body.addEventListener('transitionend', () => window.location = linkEl.href);
    };
    
    navdemos.forEach(link => link.addEventListener('click', (ev) => {
      ev.preventDefault();
      navigate(ev.target);
    }));
    
    document.addEventListener('keydown', (ev) => {
      const keyCode = ev.keyCode || ev.which;
      let linkEl;
      if (keyCode === 37) {
        linkEl = current > 0 ? navdemos[current-1] : navdemos[total-1];
      }
      else if (keyCode === 39) {
        linkEl = current < total-1 ? navdemos[current+1] : navdemos[0];
      }
      else {
        return false;
      }
      navigate(linkEl);
    });
  }
  
  // Initialize menu interactions (from original demo-tsula.js)
  const items = Array.from(document.querySelectorAll('.menu > .menu__item'));
  
  items.forEach(item => {
    // Setup elements
    const label = item.querySelector('.menu__item-label');
    const labelLetters = charming(label);
    let isActive = false;
    let mouseTimeout;
    
    // Event handlers
    const mouseenterFn = () => {
      mouseTimeout = setTimeout(() => {
        isActive = true;
        
        // Animate letters with staggered timing (replicating anime.js)
        animateElements(labelLetters, {
          duration: 20,
          delay: (t, i) => (i + 5) * 30,
          easing: 'linear',
          opacity: [0, 1]
        });
      }, 50);
    };
    
    const mouseleaveFn = () => {
      clearTimeout(mouseTimeout);
      if (!isActive) return;
      isActive = false;
    };
    
    // Attach events
    item.addEventListener('mouseenter', mouseenterFn);
    item.addEventListener('touchstart', mouseenterFn);
    item.addEventListener('mouseleave', mouseleaveFn);
    item.addEventListener('touchend', mouseleaveFn);
  });
});



// Add this script to handle lazy loading of the GIF
document.addEventListener('DOMContentLoaded', function() {
  // Handle lazy loading for GIFs
  var lazyGifs = document.querySelectorAll('.lazy-gif');
  
  if ('IntersectionObserver' in window) {
    let lazyGifObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyGif = entry.target;
          lazyGif.src = lazyGif.dataset.src;
          lazyGif.classList.remove('lazy-gif');
          lazyGifObserver.unobserve(lazyGif);
        }
      });
    });
    
    lazyGifs.forEach(function(lazyGif) {
      lazyGifObserver.observe(lazyGif);
    });
  } else {
    // Fallback for browsers without intersection observer
    setTimeout(function() {
      lazyGifs.forEach(function(lazyGif) {
        lazyGif.src = lazyGif.dataset.src;
        lazyGif.classList.remove('lazy-gif');
      });
    }, 500); // Small delay to allow critical content to load first
  }
});


// Optimized audio handling
const audioControl = document.getElementById('audioControl');
const audioOnIcon = document.getElementById('audioOnIcon');
const audioOffIcon = document.getElementById('audioOffIcon');
const backgroundMusic = document.getElementById('backgroundMusic');

// Check if user previously set a preference
const audioPreference = localStorage.getItem('audioPreference');
let audioPlaying = false;

// Set the initial state of audio icons based on preference
if (audioPreference === 'off') {
  audioPlaying = false;
  audioOnIcon.style.display = 'none';
  audioOffIcon.style.display = 'block';
} else {
  audioOnIcon.style.display = 'block';
  audioOffIcon.style.display = 'none';
}

// Only start audio loading/playing after user interaction
const setupAudioAfterInteraction = function() {
  // Only set up once
  document.removeEventListener('click', setupAudioAfterInteraction);
  document.removeEventListener('touchstart', setupAudioAfterInteraction);
  document.removeEventListener('keydown', setupAudioAfterInteraction);
  
  // Defer loading the audio file
  setTimeout(() => {
    if (audioPreference !== 'off') {
      // Start loading the audio file
      backgroundMusic.preload = 'auto';
      
      // Play after a slight delay to prevent blocking
      setTimeout(() => {
        backgroundMusic.play().then(() => {
          audioPlaying = true;
        }).catch(error => {
          console.log('Auto-play prevented by browser:', error);
          audioPlaying = false;
          audioOnIcon.style.display = 'none';
          audioOffIcon.style.display = 'block';
        });
      }, 1000);
    }
  }, 500); // Delay audio loading
};

// Listen for initial interaction
document.addEventListener('click', setupAudioAfterInteraction);
document.addEventListener('touchstart', setupAudioAfterInteraction);
document.addEventListener('keydown', setupAudioAfterInteraction);

// Toggle audio on button click
audioControl.addEventListener('click', function(e) {
  e.stopPropagation(); // Prevent triggering document click
  
  if (audioPlaying) {
    backgroundMusic.pause();
    audioPlaying = false;
    audioOnIcon.style.display = 'none';
    audioOffIcon.style.display = 'block';
    localStorage.setItem('audioPreference', 'off');
  } else {
    // Ensure audio file is loaded before playing
    if (backgroundMusic.readyState === 0) {
      backgroundMusic.preload = 'auto';
      backgroundMusic.load();
    }
    
    backgroundMusic.play().then(() => {
      audioPlaying = true;
      audioOnIcon.style.display = 'block';
      audioOffIcon.style.display = 'none';
      localStorage.setItem('audioPreference', 'on');
    }).catch(error => {
      console.error('Audio playback failed:', error);
    });
  }
});