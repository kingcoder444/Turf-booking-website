// Main application initialization and routing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Handle hash changes for routing
    window.addEventListener('hashchange', handleRouting);
    
    // Initial route handling
    handleRouting();
});

function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Initialize authentication state
    const currentUser = AuthManager.getCurrentUser();
    updateUIForUser(currentUser);
    
    // Set up event listeners
    setupEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        hideLoading();
    }, 1000);
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Modal close handling
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Auth form submission
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }
    
    // Filter change events
    const filterElements = [
        'location-filter',
        'sport-filter', 
        'price-filter',
        'amenities-filter'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

function handleRouting() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#booking/')) {
        const turfId = parseInt(hash.split('/')[1]);
        if (turfId && dataManager.getTurf(turfId)) {
            BookingManager.showBookingPage(turfId);
            showPage('booking');
        } else {
            // Invalid turf ID, redirect to browse
            window.location.hash = '';
            showPage('browse');
        }
    } else if (hash.startsWith('#turf/')) {
        const turfId = parseInt(hash.split('/')[1]);
        if (turfId) {
            showTurfDetails(turfId);
        }
    } else {
        // Default routing
        const currentUser = AuthManager.getCurrentUser();
        if (currentUser) {
            if (currentUser.role === 'admin') {
                showPage('admin');
            } else {
                showPage('browse');
            }
        } else {
            showPage('home');
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
    
    // Ctrl/Cmd + K for search (future enhancement)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Focus on search if available
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Performance optimization: Intersection Observer for lazy loading
const observeImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.classList.add('fade-in');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Call observe images when content is loaded
const originalLoadTurfs = loadTurfs;
loadTurfs = function(filters) {
    originalLoadTurfs(filters);
    setTimeout(observeImages, 100);
};

// Error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Service worker registration for future PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here in a production app
        console.log('App loaded successfully');
    });
}

// Prevent form submission on Enter in search fields
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.target.type === 'search') {
        event.preventDefault();
        applyFilters();
    }
});

// Auto-save form data (for add turf form)
function enableAutoSave(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            sessionStorage.setItem(`${formId}-autosave`, JSON.stringify(data));
        });
    });
    
    // Restore saved data
    const savedData = sessionStorage.getItem(`${formId}-autosave`);
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

// Network status handling
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline', 'warning');
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced filter application
const debouncedApplyFilters = debounce(applyFilters, 300);

// Export for global access
window.TurfBookApp = {
    showPage,
    BookingManager,
    AuthManager,
    dataManager,
    showNotification
};

console.log('TurfBook App initialized successfully! 🏟️');