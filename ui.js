// UI Management functions
let currentPage = 'home';
let currentTheme = localStorage.getItem('theme') || 'light';

// Page management
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    let targetPage;
    if (pageName === 'booking') {
        targetPage = document.getElementById('booking-content');
    } else {
        targetPage = document.getElementById(`${pageName}-page`);
    }
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Load page-specific content
        switch(pageName) {
            case 'browse':
                loadTurfs();
                break;
            case 'bookings':
                loadUserBookings();
                break;
            case 'admin':
                loadAdminContent();
                break;
            case 'profile':
                const user = AuthManager.getCurrentUser();
                if (user) {
                    document.getElementById('profile-name').textContent = user.name;
                    document.getElementById('profile-email').textContent = user.email;
                    document.getElementById('profile-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=128`;
                }
                break;
        }
    }
}

// Theme management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Initialize theme
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Navigation menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        max-width: 300px;
        animation: slideInDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Loading management
function showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '1';
        }, 300);
    }
}

// Filter management
function applyFilters() {
    const location = document.getElementById('location-filter').value;
    const sport = document.getElementById('sport-filter').value;
    const price = document.getElementById('price-filter').value;
    const amenities = document.getElementById('amenities-filter').value;
    
    loadTurfs({ location, sport, price, amenities });
}

function clearFilters() {
    document.getElementById('location-filter').value = '';
    document.getElementById('sport-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('amenities-filter').value = '';
    
    loadTurfs();
}

// Load turfs with filtering
function loadTurfs(filters = {}) {
    const turfsGrid = document.getElementById('turfs-grid');
    if (!turfsGrid) return;
    
    let turfs = dataManager.getTurfs();
    
    // Apply filters
    if (filters.location) {
        turfs = turfs.filter(turf => turf.city === filters.location);
    }
    
    if (filters.sport) {
        turfs = turfs.filter(turf => turf.sport.includes(filters.sport));
    }
    
    if (filters.price) {
        const [min, max] = filters.price.split('-').map(p => 
            p.includes('+') ? Infinity : parseInt(p)
        );
        turfs = turfs.filter(turf => {
            if (max === Infinity) return turf.price >= min;
            return turf.price >= min && turf.price <= max;
        });
    }
    
    if (filters.amenities) {
        turfs = turfs.filter(turf => turf.amenities.includes(filters.amenities));
    }
    
    // Render turfs
    turfsGrid.innerHTML = turfs.map(turf => `
        <div class="turf-card animate-scale-in" onclick="showTurfDetails(${turf.id})">
            <div class="turf-image">
                <img src="${turf.image}" alt="${turf.name}" loading="lazy">
                <div class="turf-badge">${turf.sport.join(', ')}</div>
            </div>
            <div class="turf-info">
                <div class="turf-header">
                    <h3 class="turf-name">${turf.name}</h3>
                    <span class="turf-price">₹${turf.price}/hr</span>
                </div>
                <div class="turf-location">
                    📍 ${turf.location}
                </div>
                <div class="turf-amenities">
                    ${turf.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
                <div class="turf-footer">
                    <div class="rating">
                        <div class="stars">
                            ${generateStars(turf.rating)}
                        </div>
                        <span>${turf.rating} (${turf.reviews})</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); bookTurf(${turf.id})">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (turfs.length === 0) {
        turfsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No turfs found</h3>
                <p>Try adjusting your filters to see more results.</p>
            </div>
        `;
    }
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }
    
    return stars;
}

// Show turf details modal
function showTurfDetails(turfId) {
    const turf = dataManager.getTurf(turfId);
    const reviews = dataManager.getReviews(turfId);
    const modal = document.getElementById('turf-modal');
    const details = document.getElementById('turf-details');
    
    details.innerHTML = `
        <div style="padding: 2rem;">
            <img src="${turf.image}" alt="${turf.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h2 style="margin-bottom: 0.5rem;">${turf.name}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">📍 ${turf.location}</p>
                    <div class="rating">
                        <div class="stars">${generateStars(turf.rating)}</div>
                        <span>${turf.rating} (${turf.reviews} reviews)</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">₹${turf.price}/hr</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">Available: ${turf.availableHours}</div>
                </div>
            </div>
            
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.6;">${turf.description}</p>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Sports Available:</h4>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${turf.sport.map(sport => `<span class="badge badge-primary">${sport}</span>`).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Amenities:</h4>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${turf.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem;">Reviews (${reviews.length})</h4>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${reviews.length > 0 ? reviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <span class="review-author">${review.author}</span>
                                <div>
                                    <div class="stars" style="font-size: 0.8rem;">${generateStars(review.rating)}</div>
                                    <span class="review-date">${formatDate(review.date)}</span>
                                </div>
                            </div>
                            <p class="review-text">${review.text}</p>
                        </div>
                    `).join('') : '<p style="color: var(--text-secondary);">No reviews yet. Be the first to review!</p>'}
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-primary btn-lg" onclick="closeTurfModal(); bookTurf(${turf.id})">
                    Book This Turf
                </button>
                <button class="btn btn-secondary" onclick="closeTurfModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeTurfModal() {
    const modal = document.getElementById('turf-modal');
    modal.classList.remove('active');
}

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(timeStr) {
    const [start, end] = timeStr.split('-');
    return `${convertTo12Hour(start)} - ${convertTo12Hour(end)}`;
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Initialize UI
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // Set up mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('turf-modal');
        if (event.target === modal) {
            closeTurfModal();
        }
    });
    
    // Hide loading screen after initialization
    setTimeout(hideLoading, 1000);
});