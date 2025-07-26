// Booking Management
class BookingManager {
    static showBookingPage(turfId) {
        const turf = dataManager.getTurf(turfId);
        if (!turf) return;
        
        const bookingContent = document.getElementById('booking-content');
        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        const maxDateStr = maxDate.toISOString().split('T')[0];
        
        bookingContent.innerHTML = `
            <div class="booking-container">
                <div class="page-header">
                    <h1>Book ${turf.name}</h1>
                    <p>Select your preferred date and time</p>
                </div>
                
                <div class="booking-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div class="turf-summary card">
                        <div class="card-body">
                            <img src="${turf.image}" alt="${turf.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                            <h3>${turf.name}</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">📍 ${turf.location}</p>
                            <div class="rating" style="margin-bottom: 1rem;">
                                <div class="stars">${generateStars(turf.rating)}</div>
                                <span>${turf.rating} (${turf.reviews})</span>
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color);">₹${turf.price}/hour</div>
                        </div>
                    </div>
                    
                    <div class="booking-form card">
                        <div class="card-body">
                            <h3 style="margin-bottom: 1rem;">Booking Details</h3>
                            <form id="booking-form">
                                <div class="form-group">
                                    <label for="booking-date">Select Date</label>
                                    <input type="date" id="booking-date" min="${today}" max="${maxDateStr}" required onchange="loadTimeSlots(${turf.id})">
                                </div>
                                
                                <div class="form-group">
                                    <label>Available Time Slots</label>
                                    <div id="time-slots-container">
                                        <p style="color: var(--text-secondary);">Please select a date first</p>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="player-count">Number of Players</label>
                                    <select id="player-count" required>
                                        <option value="">Select players</option>
                                        <option value="5-a-side">5-a-side</option>
                                        <option value="7-a-side">7-a-side</option>
                                        <option value="11-a-side">11-a-side</option>
                                        <option value="full-team">Full Team</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="special-requests">Special Requests (Optional)</label>
                                    <textarea id="special-requests" placeholder="Any special requirements..."></textarea>
                                </div>
                                
                                <div class="booking-summary" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                                    <h4>Booking Summary</h4>
                                    <div id="summary-details">
                                        <p>Please select date and time to see summary</p>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="promo-code">Promo Code (Optional)</label>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <input type="text" id="promo-code" placeholder="Enter promo code">
                                        <button type="button" class="btn btn-secondary" onclick="applyPromoCode()">Apply</button>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary btn-fullwidth btn-lg" id="book-submit" disabled>
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="available-offers" style="margin-top: 2rem;">
                    <h3>Available Offers</h3>
                    <div class="offers-grid">
                        ${dataManager.getOffers().map(offer => `
                            <div class="offer-card">
                                <div class="offer-badge">${offer.discount}% OFF</div>
                                <h4>${offer.title}</h4>
                                <p>${offer.description}</p>
                                <code style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 4px;">
                                    ${offer.code}
                                </code>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Set up form handler
        document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
    }
    
    static loadTimeSlots(turfId) {
        const selectedDate = document.getElementById('booking-date').value;
        if (!selectedDate) return;
        
        const container = document.getElementById('time-slots-container');
        const bookedSlots = dataManager.getBookedSlots(turfId, selectedDate);
        const timeSlots = [
            "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
            "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
            "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
            "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
        ];
        
        container.innerHTML = `
            <div class="time-slots">
                ${timeSlots.map(slot => `
                    <div class="time-slot ${bookedSlots.includes(slot) ? 'booked' : ''}" 
                         onclick="selectTimeSlot('${slot}', ${turfId})" 
                         data-slot="${slot}">
                        <div style="font-weight: 600;">${formatTime(slot)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">
                            ${bookedSlots.includes(slot) ? 'Booked' : 'Available'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    static selectTimeSlot(slot, turfId) {
        const slotEl = document.querySelector(`[data-slot="${slot}"]`);
        if (slotEl.classList.contains('booked')) {
            return;
        }
        // Toggle selection
        slotEl.classList.toggle('selected');
        // Enable/disable book button based on selection
        const selectedSlots = Array.from(document.querySelectorAll('.time-slot.selected'));
        document.getElementById('book-submit').disabled = selectedSlots.length === 0;
        // Update booking summary
        this.updateBookingSummary(turfId);
    }
    
    static updateBookingSummary(turfId) {
        const turf = dataManager.getTurf(turfId);
        const date = document.getElementById('booking-date').value;
        const summaryDetails = document.getElementById('summary-details');
        const selectedSlots = Array.from(document.querySelectorAll('.time-slot.selected')).map(el => el.dataset.slot);
        if (selectedSlots.length === 0) {
            summaryDetails.innerHTML = '<p>Please select date and time to see summary</p>';
            return;
        }
        let totalPrice = turf.price * selectedSlots.length;
        let discount = 0;
        // Check for applied promo code
        const promoCode = document.getElementById('promo-code').value;
        if (promoCode) {
            const offer = dataManager.getOffer(promoCode);
            if (offer) {
                discount = (totalPrice * offer.discount) / 100;
            }
        }
        const finalPrice = totalPrice - discount;
        summaryDetails.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Date:</span>
                <span>${formatDate(date)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Time:</span>
                <span>${selectedSlots.map(formatTime).join(', ')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Duration:</span>
                <span>${selectedSlots.length} hour(s)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Base Price:</span>
                <span>₹${totalPrice}</span>
            </div>
            ${discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--success-color);">
                    <span>Discount:</span>
                    <span>-₹${discount}</span>
                </div>
            ` : ''}
            <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem;">
                <span>Total:</span>
                <span style="color: var(--primary-color);">₹${finalPrice}</span>
            </div>
        `;
    }
    
    static handleBookingSubmit(event) {
        event.preventDefault();
        if (!AuthManager.isAuthenticated()) {
            showNotification('Please sign in to book a turf', 'warning');
            showPage('auth');
            return;
        }
        const selectedSlots = Array.from(document.querySelectorAll('.time-slot.selected')).map(el => el.dataset.slot);
        if (selectedSlots.length === 0) {
            showNotification('Please select at least one time slot', 'warning');
            return;
        }
        // Show payment modal
        this.showPaymentModal();
    }
    
    static showPaymentModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <div style="padding: 2rem;">
                    <h2 style="text-align: center; margin-bottom: 1.5rem;">Complete Payment</h2>
                    
                    <div class="payment-methods" style="margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 1rem;">Select Payment Method</h4>
                        <div style="display: grid; gap: 0.5rem;">
                            <label class="payment-option" style="display: flex; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;">
                                <input type="radio" name="payment-method" value="upi" checked style="margin-right: 1rem;">
                                <div>
                                    <strong>UPI Payment</strong>
                                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Pay using Google Pay, PhonePe, Paytm</div>
                                </div>
                            </label>
                            <label class="payment-option" style="display: flex; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;">
                                <input type="radio" name="payment-method" value="card" style="margin-right: 1rem;">
                                <div>
                                    <strong>Credit/Debit Card</strong>
                                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Visa, Mastercard, RuPay</div>
                                </div>
                            </label>
                            <label class="payment-option" style="display: flex; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;">
                                <input type="radio" name="payment-method" value="wallet" style="margin-right: 1rem;">
                                <div>
                                    <strong>Digital Wallet</strong>
                                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Paytm, Amazon Pay, Mobikwik</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button class="btn btn-primary btn-lg" onclick="processPayment()" style="min-width: 200px;">
                            💳 Pay Now
                        </button>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                            🔒 Your payment is secured with 256-bit SSL encryption
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    static processPayment() {
        // Simulate payment processing
        const paymentBtn = document.querySelector('.modal .btn-primary');
        paymentBtn.innerHTML = '⏳ Processing...';
        paymentBtn.disabled = true;
        setTimeout(() => {
            // Create booking
            const turfId = parseInt(window.location.hash.split('/')[1] || '1');
            const turf = dataManager.getTurf(turfId);
            const date = document.getElementById('booking-date').value;
            const selectedSlots = Array.from(document.querySelectorAll('.time-slot.selected')).map(el => el.dataset.slot);
            const playerCount = document.getElementById('player-count').value;
            const specialRequests = document.getElementById('special-requests').value;
            const user = AuthManager.getCurrentUser();
            let price = turf.price * selectedSlots.length;
            const promoCode = document.getElementById('promo-code').value;
            if (promoCode) {
                const offer = dataManager.getOffer(promoCode);
                if (offer) {
                    price = price - (price * offer.discount / 100);
                }
            }
            const booking = {
                turfId: turf.id,
                turfName: turf.name,
                userId: user.email,
                date: date,
                time: selectedSlots,
                playerCount: playerCount,
                specialRequests: specialRequests,
                price: price,
                status: 'confirmed',
                paymentStatus: 'paid'
            };
            const newBooking = dataManager.addBooking(booking);
            // Close modal and show success
            document.querySelector('.modal').remove();
            showNotification('Booking confirmed successfully! 🎉', 'success');
            showNotification('A confirmation has been sent to your email.', 'info');
            showPage('bookings');
        }, 2000);
    }
}

// Load user bookings
function loadUserBookings() {
    const user = AuthManager.getCurrentUser();
    if (!user) {
        showPage('auth');
        return;
    }
    let bookings = [];
    if (showAllBookingsDebug) {
        bookings = dataManager.getBookings ? dataManager.getBookings() : [];
    } else {
        bookings = dataManager.getUserBookings(user.email);
    }
    // If there are no bookings at all, show a message
    const allBookings = dataManager.getBookings ? dataManager.getBookings() : [];
    if (allBookings.length === 0) {
        const bookingsList = document.getElementById('bookings-list');
        bookingsList.innerHTML = `<div style="text-align: center; padding: 2rem;"><h3>No bookings in the system</h3><p>Be the first to book a turf!</p></div>`;
        return;
    }
    switchBookingTab('upcoming', bookings);
}

function switchBookingTab(tab, overrideBookings) {
    const upcomingBtn = document.querySelector('.booking-tabs .tab-btn:first-child');
    const pastBtn = document.querySelector('.booking-tabs .tab-btn:last-child');
    const bookingsList = document.getElementById('bookings-list');
    if (tab === 'upcoming') {
        upcomingBtn.classList.add('active');
        pastBtn.classList.remove('active');
    } else {
        upcomingBtn.classList.remove('active');
        pastBtn.classList.add('active');
    }
    const user = AuthManager.getCurrentUser();
    let allBookings = overrideBookings || dataManager.getUserBookings(user.email);
    const today = new Date().toISOString().split('T')[0];
    const filteredBookings = allBookings.filter(booking => {
        if (tab === 'upcoming') {
            return booking.date >= today && booking.status !== 'cancelled';
        } else {
            return booking.date < today || booking.status === 'cancelled';
        }
    });
    bookingsList.innerHTML = filteredBookings.length > 0 ? 
        filteredBookings.map(booking => `
            <div class="booking-card animate-slide-up">
                <div class="booking-header">
                    <h3 class="booking-turf">${booking.turfName}</h3>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <strong>Date</strong>
                        <span>${formatDate(booking.date)}</span>
                    </div>
                    <div class="booking-detail">
                        <strong>Time</strong>
                        <span>${Array.isArray(booking.time) ? booking.time.map(formatTime).join(', ') : formatTime(booking.time)}</span>
                    </div>
                    <div class="booking-detail">
                        <strong>Price</strong>
                        <span>₹${booking.price}</span>
                    </div>
                    <div class="booking-detail">
                        <strong>Payment</strong>
                        <span class="badge badge-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}">${booking.paymentStatus}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-secondary btn-sm" onclick="rescheduleBooking(${booking.id})">
                        Reschedule
                    </button>
                    <button class="btn btn-error btn-sm" onclick="cancelBooking(${booking.id})">
                        Cancel
                    </button>
                </div>
            </div>
        `).join('') 
        : `
            <div style="text-align: center; padding: 2rem;">
                <h3>No ${tab} bookings</h3>
                <p>You don't have any ${tab} bookings yet.</p>
                ${tab === 'upcoming' ? '<button class="btn btn-primary" onclick="showPage(\'browse\')">Book a Turf</button>' : ''}
            </div>
        `;
}

function bookTurf(turfId) {
    if (!AuthManager.isAuthenticated()) {
        showNotification('Please sign in to book a turf', 'warning');
        showPage('auth');
        return;
    }
    
    window.location.hash = `booking/${turfId}`;
    BookingManager.showBookingPage(turfId);
    showPage('booking');
}

function loadTimeSlots(turfId) {
    BookingManager.loadTimeSlots(turfId);
}

function selectTimeSlot(slot, turfId) {
    BookingManager.selectTimeSlot(slot, turfId);
}

function handleBookingSubmit(event) {
    BookingManager.handleBookingSubmit(event);
}

function processPayment() {
    BookingManager.processPayment();
}

function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value.toUpperCase();
    const offer = dataManager.getOffer(promoCode);
    
    if (offer) {
        showNotification(`Promo code applied! ${offer.discount}% discount`, 'success');
        // Update summary if slot is selected
        const selectedSlot = document.querySelector('.time-slot.selected');
        if (selectedSlot) {
            const turfId = parseInt(window.location.hash.split('/')[1]);
            BookingManager.updateBookingSummary(turfId);
        }
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

function cancelBooking(bookingId) {
    const booking = dataManager.getBookings().find(b => b.id === bookingId);
    if (!booking) return;
    // Check if the booking is more than 24 hours from now
    const bookingDate = new Date(booking.date + 'T' + (Array.isArray(booking.time) ? booking.time[0].split('-')[0] : booking.time.split('-')[0]) + ':00');
    const now = new Date();
    const diffMs = bookingDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    let warning = '';
    if (diffHours >= 24) {
        warning = '\n\nNote: Cancelling more than 24 hours before the booking will result in 100% deduction of the booking amount.';
    }
    if (confirm('Are you sure you want to cancel this booking?' + warning)) {
        dataManager.updateBooking(bookingId, { status: 'cancelled' });
        showNotification('Booking cancelled successfully', 'success');
        loadUserBookings();
    }
}

function rescheduleBooking(bookingId) {
    const booking = dataManager.getBookings().find(b => b.id === bookingId);
    if (booking) {
        // For simplicity, redirect to booking page
        bookTurf(booking.turfId);
        showNotification('Please select new date and time', 'info');
        // Cancel old booking
        dataManager.updateBooking(bookingId, { status: 'cancelled' });
    }
}

// Debug mode: show all bookings for all users if Ctrl+D is pressed on bookings page
let showAllBookingsDebug = false;
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key.toLowerCase() === 'd' && currentPage === 'bookings') {
        showAllBookingsDebug = !showAllBookingsDebug;
        loadUserBookings();
        showNotification(showAllBookingsDebug ? 'Debug: Showing all bookings' : 'Debug: Showing only your bookings', 'info');
    }
});