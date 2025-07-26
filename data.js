// Mock data for the application
const MOCK_DATA = {
    // Sample turfs
    turfs: [
        {
            id: 1,
            name: "Green Valley Football Turf",
            location: "Mumbai",
            city: "mumbai",
            sport: ["football", "cricket"],
            price: 1500,
            amenities: ["parking", "washroom", "lights", "canteen"],
            image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.5,
            reviews: 24,
            description: "Premium football turf with excellent drainage and lighting system.",
            availableHours: "06:00-23:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 2,
            name: "Champions Cricket Ground",
            location: "Delhi",
            city: "delhi",
            sport: ["cricket"],
            price: 2000,
            amenities: ["parking", "washroom", "canteen"],
            image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.8,
            reviews: 18,
            description: "Professional cricket ground with quality pitch and facilities.",
            availableHours: "05:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 3,
            name: "Elite Tennis Courts",
            location: "Bangalore",
            city: "bangalore",
            sport: ["tennis"],
            price: 800,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.3,
            reviews: 31,
            description: "Modern tennis courts with professional-grade surface.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 4,
            name: "Power Play Badminton Arena",
            location: "Pune",
            city: "pune",
            sport: ["badminton"],
            price: 600,
            amenities: ["parking", "washroom", "lights", "canteen"],
            image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.6,
            reviews: 42,
            description: "Indoor badminton courts with air conditioning and quality flooring.",
            availableHours: "06:00-23:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 5,
            name: "Royal Football Academy",
            location: "Mumbai",
            city: "mumbai",
            sport: ["football"],
            price: 1800,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.4,
            reviews: 19,
            description: "Academy-grade football turf perfect for training and matches.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 6,
            name: "Metro Sports Complex",
            location: "Delhi",
            city: "delhi",
            sport: ["football", "cricket", "tennis"],
            price: 2500,
            amenities: ["parking", "washroom", "lights", "canteen"],
            image: "https://images.pexels.com/photos/163452/basketball-court-sport-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.7,
            reviews: 55,
            description: "Multi-sport complex with various courts and excellent facilities.",
            availableHours: "05:00-23:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 7,
            name: "Sunrise Football Park",
            location: "Mumbai",
            city: "mumbai",
            sport: ["football"],
            price: 1600,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.2,
            reviews: 12,
            description: "Spacious football turf with modern facilities and night lighting.",
            availableHours: "07:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 8,
            name: "Mumbai Multi Sports",
            location: "Mumbai",
            city: "mumbai",
            sport: ["tennis", "badminton"],
            price: 1300,
            amenities: ["parking", "washroom", "canteen"],
            image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.3,
            reviews: 16,
            description: "Multi-sport complex for tennis and badminton in Mumbai.",
            availableHours: "07:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 9,
            name: "Delhi Sports Arena",
            location: "Delhi",
            city: "delhi",
            sport: ["badminton", "tennis"],
            price: 1200,
            amenities: ["parking", "washroom", "canteen"],
            image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.1,
            reviews: 15,
            description: "Indoor and outdoor courts for badminton and tennis.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 10,
            name: "Delhi Cricket Pavilion",
            location: "Delhi",
            city: "delhi",
            sport: ["cricket"],
            price: 2100,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.2,
            reviews: 13,
            description: "Top-class cricket pavilion with professional pitch.",
            availableHours: "05:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 11,
            name: "Delhi Tennis Club",
            location: "Delhi",
            city: "delhi",
            sport: ["tennis"],
            price: 950,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.4,
            reviews: 14,
            description: "Exclusive tennis club with clay and hard courts.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 12,
            name: "Bangalore Arena",
            location: "Bangalore",
            city: "bangalore",
            sport: ["football", "cricket"],
            price: 1700,
            amenities: ["parking", "washroom", "lights", "canteen"],
            image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.6,
            reviews: 22,
            description: "Multi-sport arena with lush green fields and great amenities.",
            availableHours: "06:00-23:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 13,
            name: "Bangalore Smash Courts",
            location: "Bangalore",
            city: "bangalore",
            sport: ["badminton"],
            price: 700,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.4,
            reviews: 20,
            description: "Premium indoor badminton courts with AC and LED lighting.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 14,
            name: "Bangalore Pro Turf",
            location: "Bangalore",
            city: "bangalore",
            sport: ["football", "tennis"],
            price: 1550,
            amenities: ["parking", "washroom", "canteen"],
            image: "https://images.pexels.com/photos/163452/basketball-court-sport-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.5,
            reviews: 18,
            description: "Professional turf for football and tennis in Bangalore.",
            availableHours: "06:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 15,
            name: "Pune Champions Turf",
            location: "Pune",
            city: "pune",
            sport: ["football", "tennis"],
            price: 900,
            amenities: ["parking", "washroom", "lights"],
            image: "https://images.pexels.com/photos/163452/basketball-court-sport-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.3,
            reviews: 17,
            description: "Well-maintained turf for football and tennis lovers.",
            availableHours: "07:00-22:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 16,
            name: "Pune Sports Hub",
            location: "Pune",
            city: "pune",
            sport: ["cricket", "badminton"],
            price: 1100,
            amenities: ["parking", "washroom", "canteen"],
            image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.5,
            reviews: 25,
            description: "All-in-one sports hub for cricket and badminton enthusiasts.",
            availableHours: "06:00-23:00",
            ownerId: "admin@demo.com"
        },
        {
            id: 17,
            name: "Pune Arena",
            location: "Pune",
            city: "pune",
            sport: ["football", "cricket"],
            price: 1400,
            amenities: ["parking", "washroom", "lights", "canteen"],
            image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800",
            rating: 4.7,
            reviews: 21,
            description: "Spacious arena for football and cricket matches in Pune.",
            availableHours: "06:00-23:00",
            ownerId: "admin@demo.com"
        }
    ],

    // Sample reviews
    reviews: {
        1: [
            {
                id: 1,
                author: "Rahul Sharma",
                rating: 5,
                date: "2024-01-15",
                text: "Excellent turf with great facilities. The lighting is perfect for evening games."
            },
            {
                id: 2,
                author: "Priya Patel",
                rating: 4,
                date: "2024-01-10",
                text: "Good quality turf, but parking can be crowded during peak hours."
            },
            {
                id: 3,
                author: "Amit Kumar",
                rating: 5,
                date: "2024-01-08",
                text: "Amazing experience! Clean facilities and well-maintained ground."
            }
        ],
        2: [
            {
                id: 4,
                author: "Vikram Singh",
                rating: 5,
                date: "2024-01-12",
                text: "Best cricket ground in the area. Professional setup and great pitch quality."
            },
            {
                id: 5,
                author: "Sneha Reddy",
                rating: 4,
                date: "2024-01-07",
                text: "Good facilities but could use more seating areas for spectators."
            }
        ],
        3: [
            {
                id: 6,
                author: "Rajesh Gupta",
                rating: 4,
                date: "2024-01-14",
                text: "Nice tennis courts with good surface quality. Booking system is convenient."
            },
            {
                id: 7,
                author: "Anita Joshi",
                rating: 5,
                date: "2024-01-11",
                text: "Excellent courts and very clean facilities. Highly recommended!"
            }
        ]
    },

    // Sample bookings
    bookings: [
        {
            id: 1,
            turfId: 1,
            turfName: "Green Valley Football Turf",
            userId: "user@demo.com",
            date: "2024-01-20",
            time: "18:00-19:00",
            price: 1500,
            status: "confirmed",
            paymentStatus: "paid",
            createdAt: "2024-01-15T10:30:00Z"
        },
        {
            id: 2,
            turfId: 2,
            turfName: "Champions Cricket Ground",
            userId: "user@demo.com",
            date: "2024-01-18",
            time: "16:00-18:00",
            price: 4000,
            status: "confirmed",
            paymentStatus: "paid",
            createdAt: "2024-01-14T15:20:00Z"
        }
    ],

    // Sample time slots (this would be dynamic in a real app)
    timeSlots: [
        "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
        "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
        "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
        "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00",
        "22:00-23:00"
    ],

    // Offers
    offers: [
        {
            id: 1,
            title: "First Time Booking",
            discount: 20,
            code: "FIRST20",
            description: "Get 20% off on your first turf booking"
        },
        {
            id: 2,
            title: "Weekend Special",
            discount: 15,
            code: "WEEKEND15",
            description: "Special discount for weekend bookings"
        }
    ]
};

// Data management functions
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize localStorage with mock data if not exists
        if (!localStorage.getItem('turfs')) {
            localStorage.setItem('turfs', JSON.stringify(MOCK_DATA.turfs));
        }
        if (!localStorage.getItem('reviews')) {
            localStorage.setItem('reviews', JSON.stringify(MOCK_DATA.reviews));
        }
        if (!localStorage.getItem('bookings')) {
            localStorage.setItem('bookings', JSON.stringify(MOCK_DATA.bookings));
        }
        if (!localStorage.getItem('offers')) {
            localStorage.setItem('offers', JSON.stringify(MOCK_DATA.offers));
        }
    }

    // Turf operations
    getTurfs() {
        return JSON.parse(localStorage.getItem('turfs') || '[]');
    }

    getTurf(id) {
        const turfs = this.getTurfs();
        return turfs.find(turf => turf.id === parseInt(id));
    }

    addTurf(turf) {
        const turfs = this.getTurfs();
        const newTurf = {
            ...turf,
            id: Date.now(),
            rating: 0,
            reviews: 0,
            ownerId: AuthManager.getCurrentUser()?.email
        };
        turfs.push(newTurf);
        localStorage.setItem('turfs', JSON.stringify(turfs));
        return newTurf;
    }

    updateTurf(id, updates) {
        const turfs = this.getTurfs();
        const index = turfs.findIndex(turf => turf.id === parseInt(id));
        if (index !== -1) {
            turfs[index] = { ...turfs[index], ...updates };
            localStorage.setItem('turfs', JSON.stringify(turfs));
            return turfs[index];
        }
        return null;
    }

    deleteTurf(id) {
        const turfs = this.getTurfs();
        const filteredTurfs = turfs.filter(turf => turf.id !== parseInt(id));
        localStorage.setItem('turfs', JSON.stringify(filteredTurfs));
    }

    // Review operations
    getReviews(turfId) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
        return reviews[turfId] || [];
    }

    addReview(turfId, review) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
        if (!reviews[turfId]) {
            reviews[turfId] = [];
        }
        const newReview = {
            ...review,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        reviews[turfId].push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Update turf rating
        this.updateTurfRating(turfId);
        return newReview;
    }

    updateTurfRating(turfId) {
        const reviews = this.getReviews(turfId);
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            this.updateTurf(turfId, { 
                rating: Math.round(avgRating * 10) / 10,
                reviews: reviews.length 
            });
        }
    }

    // Booking operations
    getBookings() {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    }

    getUserBookings(userEmail) {
        const bookings = this.getBookings();
        return bookings.filter(booking => booking.userId === userEmail);
    }

    getTurfBookings(turfId) {
        const bookings = this.getBookings();
        return bookings.filter(booking => booking.turfId === parseInt(turfId));
    }

    addBooking(booking) {
        const bookings = this.getBookings();
        const newBooking = {
            ...booking,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return newBooking;
    }

    updateBooking(id, updates) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(booking => booking.id === parseInt(id));
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updates };
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return bookings[index];
        }
        return null;
    }

    deleteBooking(id) {
        const bookings = this.getBookings();
        const filteredBookings = bookings.filter(booking => booking.id !== parseInt(id));
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));
    }

    // Check if a time slot is available
    isSlotAvailable(turfId, date, time) {
        const bookings = this.getTurfBookings(turfId);
        return !bookings.some(booking => 
            booking.date === date && 
            booking.time === time && 
            booking.status !== 'cancelled'
        );
    }

    // Get booked slots for a specific turf and date
    getBookedSlots(turfId, date) {
        const bookings = this.getTurfBookings(turfId);
        return bookings
            .filter(booking => booking.date === date && booking.status !== 'cancelled')
            .map(booking => booking.time);
    }

    // Offers
    getOffers() {
        return JSON.parse(localStorage.getItem('offers') || '[]');
    }

    getOffer(code) {
        const offers = this.getOffers();
        return offers.find(offer => offer.code === code);
    }
}

// Initialize data manager
const dataManager = new DataManager();