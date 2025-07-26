// Admin Dashboard Management
function loadAdminContent() {
    if (!AuthManager.isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        showPage('home');
        return;
    }
    
    switchAdminTab('turfs');
}

function switchAdminTab(tab) {
    const adminContent = document.getElementById('admin-content');
    const tabBtns = document.querySelectorAll('.admin-tabs .tab-btn');
    
    // Update active tab
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.admin-tabs .tab-btn:nth-child(${tab === 'turfs' ? 1 : tab === 'bookings' ? 2 : 3})`).classList.add('active');
    
    switch(tab) {
        case 'turfs':
            loadAdminTurfs();
            break;
        case 'bookings':
            loadAdminBookings();
            break;
        case 'add':
            showAddTurfForm();
            break;
    }
}

function loadAdminTurfs() {
    const adminContent = document.getElementById('admin-content');
    const user = AuthManager.getCurrentUser();
    const turfs = dataManager.getTurfs().filter(turf => turf.ownerId === user.email);
    
    adminContent.innerHTML = `
        <div class="admin-turfs">
            <div class="admin-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>My Turfs (${turfs.length})</h2>
                <button class="btn btn-primary" onclick="switchAdminTab('add')">
                    + Add New Turf
                </button>
            </div>
            
            <div class="turfs-grid">
                ${turfs.length > 0 ? turfs.map(turf => `
                    <div class="admin-turf-card card">
                        <div class="card-body">
                            <img src="${turf.image}" alt="${turf.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                            <h3 style="margin-bottom: 0.5rem;">${turf.name}</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">📍 ${turf.location}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div class="rating">
                                    <div class="stars">${generateStars(turf.rating)}</div>
                                    <span>${turf.rating} (${turf.reviews})</span>
                                </div>
                                <span style="font-weight: 700; color: var(--primary-color);">₹${turf.price}/hr</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                                ${turf.sport.map(sport => `<span class="badge badge-primary">${sport}</span>`).join('')}
                            </div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                                <button class="btn btn-secondary btn-sm" onclick="editTurf(${turf.id})">
                                    Edit
                                </button>
                                <button class="btn btn-warning btn-sm" onclick="viewTurfBookings(${turf.id})">
                                    Bookings
                                </button>
                                <button class="btn btn-error btn-sm" onclick="deleteTurf(${turf.id})">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('') : `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                        <h3>No turfs added yet</h3>
                        <p>Add your first turf to start managing bookings.</p>
                        <button class="btn btn-primary" onclick="switchAdminTab('add')">Add Turf</button>
                    </div>
                `}
            </div>
        </div>
    `;
}

function loadAdminBookings() {
    const adminContent = document.getElementById('admin-content');
    const user = AuthManager.getCurrentUser();
    const userTurfs = dataManager.getTurfs().filter(turf => turf.ownerId === user.email);
    const turfIds = userTurfs.map(turf => turf.id);
    const bookings = dataManager.getBookings().filter(booking => turfIds.includes(booking.turfId));
    
    // Group bookings by status
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
    
    adminContent.innerHTML = `
        <div class="admin-bookings">
            <h2 style="margin-bottom: 2rem;">Booking Management</h2>
            
            <div class="booking-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--warning-color);">${pendingBookings.length}</div>
                    <div style="color: var(--text-secondary);">Pending</div>
                </div>
                <div class="stat-card" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${confirmedBookings.length}</div>
                    <div style="color: var(--text-secondary);">Confirmed</div>
                </div>
                <div class="stat-card" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--error-color);">${cancelledBookings.length}</div>
                    <div style="color: var(--text-secondary);">Cancelled</div>
                </div>
                <div class="stat-card" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">₹${bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.price, 0)}</div>
                    <div style="color: var(--text-secondary);">Total Revenue</div>
                </div>
            </div>
            
            <div class="bookings-list">
                ${bookings.length > 0 ? bookings.map(booking => `
                    <div class="booking-card">
                        <div class="booking-header">
                            <div>
                                <h3>${booking.turfName}</h3>
                                <p style="color: var(--text-secondary); margin: 0;">Customer: ${booking.userId}</p>
                            </div>
                            <span class="booking-status status-${booking.status}">${booking.status}</span>
                        </div>
                        <div class="booking-details">
                            <div class="booking-detail">
                                <strong>Date</strong>
                                <span>${formatDate(booking.date)}</span>
                            </div>
                            <div class="booking-detail">
                                <strong>Time</strong>
                                <span>${formatTime(booking.time)}</span>
                            </div>
                            <div class="booking-detail">
                                <strong>Price</strong>
                                <span>₹${booking.price}</span>
                            </div>
                            <div class="booking-detail">
                                <strong>Players</strong>
                                <span>${booking.playerCount || 'Not specified'}</span>
                            </div>
                        </div>
                        ${booking.specialRequests ? `
                            <div style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                                <strong>Special Requests:</strong>
                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">${booking.specialRequests}</p>
                            </div>
                        ` : ''}
                        ${booking.status === 'pending' ? `
                            <div class="booking-actions">
                                <button class="btn btn-success btn-sm" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                                    Approve
                                </button>
                                <button class="btn btn-error btn-sm" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                                    Reject
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `).join('') : `
                    <div style="text-align: center; padding: 2rem;">
                        <h3>No bookings yet</h3>
                        <p>Bookings for your turfs will appear here.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddTurfForm() {
    const adminContent = document.getElementById('admin-content');
    
    adminContent.innerHTML = `
        <div class="add-turf-form">
            <h2 style="margin-bottom: 2rem;">Add New Turf</h2>
            
            <form id="add-turf-form" class="card">
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="turf-name">Turf Name *</label>
                            <input type="text" id="turf-name" placeholder="Enter turf name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="turf-location">Location *</label>
                            <input type="text" id="turf-location" placeholder="Enter location" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="turf-city">City *</label>
                            <select id="turf-city" required>
                                <option value="">Select city</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                                <option value="pune">Pune</option>
                                <option value="chennai">Chennai</option>
                                <option value="kolkata">Kolkata</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="turf-price">Price per Hour (₹) *</label>
                            <input type="number" id="turf-price" placeholder="Enter price" min="100" step="50" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="turf-description">Description *</label>
                        <textarea id="turf-description" placeholder="Describe your turf facilities and features" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="turf-image">Image URL *</label>
                        <input type="url" id="turf-image" placeholder="Enter image URL" required>
                        <small style="color: var(--text-secondary);">Tip: Use high-quality images from Pexels or Unsplash</small>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Sports Available *</label>
                            <div class="checkbox-group" style="display: flex; flex-wrap: wrap; gap: 1rem;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="sport" value="football" style="margin-right: 0.5rem;">
                                    Football
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="sport" value="cricket" style="margin-right: 0.5rem;">
                                    Cricket
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="sport" value="tennis" style="margin-right: 0.5rem;">
                                    Tennis
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="sport" value="badminton" style="margin-right: 0.5rem;">
                                    Badminton
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Amenities</label>
                            <div class="checkbox-group" style="display: flex; flex-wrap: wrap; gap: 1rem;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="amenities" value="parking" style="margin-right: 0.5rem;">
                                    Parking
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="amenities" value="washroom" style="margin-right: 0.5rem;">
                                    Washroom
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="amenities" value="lights" style="margin-right: 0.5rem;">
                                    Floodlights
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" name="amenities" value="canteen" style="margin-right: 0.5rem;">
                                    Canteen
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="available-hours">Available Hours *</label>
                        <input type="text" id="available-hours" placeholder="e.g., 06:00-23:00" pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}" required>
                        <small style="color: var(--text-secondary);">Format: HH:MM-HH:MM (24-hour format)</small>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary btn-lg">
                            Add Turf
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="switchAdminTab('turfs')">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    // Set up form handler
    document.getElementById('add-turf-form').addEventListener('submit', handleAddTurf);
}

function handleAddTurf(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const selectedSports = Array.from(document.querySelectorAll('input[name="sport"]:checked')).map(cb => cb.value);
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
    
    if (selectedSports.length === 0) {
        showNotification('Please select at least one sport', 'warning');
        return;
    }
    
    const turfData = {
        name: document.getElementById('turf-name').value,
        location: document.getElementById('turf-location').value,
        city: document.getElementById('turf-city').value,
        price: parseInt(document.getElementById('turf-price').value),
        description: document.getElementById('turf-description').value,
        image: document.getElementById('turf-image').value,
        sport: selectedSports,
        amenities: selectedAmenities,
        availableHours: document.getElementById('available-hours').value
    };
    
    try {
        const newTurf = dataManager.addTurf(turfData);
        showNotification('Turf added successfully! 🎉', 'success');
        switchAdminTab('turfs');
    } catch (error) {
        showNotification('Error adding turf. Please try again.', 'error');
    }
}

function editTurf(turfId) {
    const turf = dataManager.getTurf(turfId);
    if (!turf) return;
    
    // For simplicity, show a basic edit form in modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="padding: 2rem;">
                <h2 style="margin-bottom: 1.5rem;">Edit Turf</h2>
                <form id="edit-turf-form">
                    <div class="form-group">
                        <label for="edit-name">Turf Name</label>
                        <input type="text" id="edit-name" value="${turf.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-price">Price per Hour (₹)</label>
                        <input type="number" id="edit-price" value="${turf.price}" min="100" step="50" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-description">Description</label>
                        <textarea id="edit-description" required>${turf.description}</textarea>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button type="submit" class="btn btn-primary">Update Turf</button>
                        <button type="button" class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.parentElement.parentElement.remove()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('edit-turf-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updates = {
            name: document.getElementById('edit-name').value,
            price: parseInt(document.getElementById('edit-price').value),
            description: document.getElementById('edit-description').value
        };
        
        dataManager.updateTurf(turfId, updates);
        modal.remove();
        showNotification('Turf updated successfully!', 'success');
        loadAdminTurfs();
    });
}

function deleteTurf(turfId) {
    if (confirm('Are you sure you want to delete this turf? This action cannot be undone.')) {
        dataManager.deleteTurf(turfId);
        showNotification('Turf deleted successfully', 'success');
        loadAdminTurfs();
    }
}

function viewTurfBookings(turfId) {
    const turf = dataManager.getTurf(turfId);
    const bookings = dataManager.getTurfBookings(turfId);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="padding: 2rem;">
                <h2 style="margin-bottom: 1.5rem;">Bookings for ${turf.name}</h2>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${bookings.length > 0 ? bookings.map(booking => `
                        <div class="booking-card" style="margin-bottom: 1rem;">
                            <div class="booking-header">
                                <div>
                                    <strong>${booking.userId}</strong>
                                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                                        ${formatDate(booking.date)} at ${formatTime(booking.time)}
                                    </p>
                                </div>
                                <span class="booking-status status-${booking.status}">${booking.status}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                                <span>₹${booking.price}</span>
                                <span class="badge badge-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}">${booking.paymentStatus}</span>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: var(--text-secondary);">No bookings yet</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateBookingStatus(bookingId, status) {
    dataManager.updateBooking(bookingId, { status });
    showNotification(`Booking ${status} successfully`, 'success');
    loadAdminBookings();
}