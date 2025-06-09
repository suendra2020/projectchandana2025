/**
 * Accessibility and interactive features for Project Chandana website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    }
    
    // Font size controls
    const decreaseFont = document.getElementById('decrease-font');
    const defaultFont = document.getElementById('default-font');
    const increaseFont = document.getElementById('increase-font');
    
    if (decreaseFont && defaultFont && increaseFont) {
        // Default font size in pixels
        let currentFontSize = 16;
        
        decreaseFont.addEventListener('click', function() {
            if (currentFontSize > 14) {
                currentFontSize -= 1;
                document.documentElement.style.fontSize = currentFontSize + 'px';
                announceChange('Font size decreased');
            } else {
                announceChange('Minimum font size reached');
            }
        });
        
        defaultFont.addEventListener('click', function() {
            currentFontSize = 16;
            document.documentElement.style.fontSize = currentFontSize + 'px';
            announceChange('Font size reset to default');
        });
        
        increaseFont.addEventListener('click', function() {
            if (currentFontSize < 24) {
                currentFontSize += 1;
                document.documentElement.style.fontSize = currentFontSize + 'px';
                announceChange('Font size increased');
            } else {
                announceChange('Maximum font size reached');
            }
        });
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const mainMenu = mainNav.querySelector('.main-menu');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !expanded);
            if (mainMenu) {
                mainMenu.classList.toggle('active');
                if (mainMenu.classList.contains('active')) {
                    announceChange('Menu opened');
                } else {
                    announceChange('Menu closed');
                }
            }
        });
    }
    
    // Keyboard navigation for dropdown menus
    const menuItems = document.querySelectorAll('.main-menu > li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const subMenu = item.querySelector('ul');
        
        if (link && subMenu) {
            // Add aria attributes
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
            
            // Toggle submenu on Enter or Space
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const expanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !expanded);
                    item.classList.toggle('open');
                }
            });
        }
    });
    
    // Animate Statistics on Scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const value = parseInt(stat.textContent.replace(/,/g, ''));
                if (!stat.dataset.animated && isElementInViewport(stat)) {
                    animateValue(stat, 0, value, 1500);
                    stat.dataset.animated = true;
                }
            });
        };
        
        window.addEventListener('scroll', animateStats);
        animateStats(); // Initial check
    }
    
    // Add current page indicator
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Accessible alert dismissal
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Add dismiss button if not already present
        if (!alert.querySelector('.alert-dismiss')) {
            const dismissBtn = document.createElement('button');
            dismissBtn.className = 'alert-dismiss';
            dismissBtn.innerHTML = '&times;';
            dismissBtn.setAttribute('aria-label', 'Dismiss alert');
            dismissBtn.setAttribute('type', 'button');
            
            dismissBtn.addEventListener('click', function() {
                alert.style.display = 'none';
                announceChange('Alert dismissed');
            });
            
            alert.appendChild(dismissBtn);
        }
    });
    
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
            let value = Math.floor(progress * (end - start) + start);
            
            // Format with commas for thousands
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            obj.innerHTML = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Announce changes to screen readers
    function announceChange(message) {
        let announce = document.getElementById('announce-changes');
        
        if (!announce) {
            announce = document.createElement('div');
            announce.id = 'announce-changes';
            announce.setAttribute('aria-live', 'polite');
            announce.setAttribute('aria-atomic', 'true');
            announce.className = 'visually-hidden';
            document.body.appendChild(announce);
        }
        
        announce.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            announce.textContent = '';
        }, 1000);
    }
});
