document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate Statistics on Scroll
    // const statNumbers = document.querySelectorAll('.stat-number');
    
    // if (statNumbers.length > 0) {
    //     const animateStats = () => {
    //         statNumbers.forEach(stat => {
    //             const value = parseInt(stat.textContent);
    //             if (!stat.dataset.animated && isElementInViewport(stat)) {
    //                 animateValue(stat, 0, value, 1500);
    //                 stat.dataset.animated = true;
    //             }
    //         });
    //     };
        
    //     window.addEventListener('scroll', animateStats);
    //     animateStats(); // Initial check
    // }

    const statNumbers = document.querySelectorAll('.stat-number');

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
}

function animateValue(el, start, end, duration, suffix = '') {
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = (start + (end - start) * progress).toFixed(2);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${end.toFixed(2)}${suffix}`;
    }
  };

  requestAnimationFrame(step);
}

function animateStats() {
  statNumbers.forEach(stat => {
    if (!stat.dataset.animated && isElementInViewport(stat)) {
      const text = stat.textContent.trim();
      const match = text.match(/^([\d.,]+)\s*([a-zA-Z]*)$/);

      if (match) {
        const rawNumber = match[1].replace(/,/g, '');
        const suffix = match[2] ? ' ' + match[2] : '';
        const number = parseFloat(rawNumber);

        if (!isNaN(number)) {
          animateValue(stat, 0, number, 1500, suffix);
          stat.dataset.animated = true;
        }
      }
    }
  });
}

if (statNumbers.length > 0) {
  window.addEventListener('scroll', animateStats);
  animateStats(); // Initial load
}

    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Helper function to animate counting
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value + (obj.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});
