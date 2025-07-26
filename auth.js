// Authentication Manager
class AuthManager {
    static getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    static setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    static isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    static isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    static login(email, password) {
        // Demo authentication - in real app, this would be server-side
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Demo credentials
        if (email === 'user@demo.com' && password === 'demo123') {
            const user = { email, name: 'Demo User', role: 'user' };
            this.setCurrentUser(user);
            return { success: true, user };
        }
        
        if (email === 'admin@demo.com' && password === 'demo123') {
            const user = { email, name: 'Demo Admin', role: 'admin' };
            this.setCurrentUser(user);
            return { success: true, user };
        }

        // Check stored users
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            this.setCurrentUser(userWithoutPassword);
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, message: 'Invalid credentials' };
    }

    static register(email, password, name, role) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }

        // Add new user
        const newUser = { email, password, name, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        this.setCurrentUser(userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
    }

    static logout() {
        this.clearCurrentUser();
    }
}

// Auth UI functions
function switchAuthTab(tab) {
    const signInTab = document.querySelector('.auth-tabs .tab-btn:first-child');
    const signUpTab = document.querySelector('.auth-tabs .tab-btn:last-child');
    const nameGroup = document.getElementById('name-group');
    const roleGroup = document.getElementById('role-group');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmit = document.getElementById('auth-submit');

    if (tab === 'signin') {
        signInTab.classList.add('active');
        signUpTab.classList.remove('active');
        nameGroup.style.display = 'none';
        roleGroup.style.display = 'none';
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to book your game';
        authSubmit.textContent = 'Sign In';
    } else {
        signInTab.classList.remove('active');
        signUpTab.classList.add('active');
        nameGroup.style.display = 'block';
        roleGroup.style.display = 'block';
        authTitle.textContent = 'Join TurfBook';
        authSubtitle.textContent = 'Create your account to get started';
        authSubmit.textContent = 'Sign Up';
    }
}

function handleAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const isSignUp = document.querySelector('.auth-tabs .tab-btn.active').textContent === 'Sign Up';
    
    let result;
    
    if (isSignUp) {
        const role = document.querySelector('input[name="role"]:checked').value;
        result = AuthManager.register(email, password, name, role);
    } else {
        result = AuthManager.login(email, password);
    }
    
    if (result.success) {
        updateUIForUser(result.user);
        showPage(result.user.role === 'admin' ? 'admin' : 'browse');
        showNotification(`Welcome ${result.user.name}!`, 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

function logout() {
    AuthManager.logout();
    updateUIForUser(null);
    showPage('home');
    showNotification('Logged out successfully', 'success');
}

function updateUIForUser(user) {
    const authBtn = document.getElementById('auth-btn');
    const userMenu = document.getElementById('user-menu');
    const userOnlyElements = document.querySelectorAll('.user-only');
    const adminOnlyElements = document.querySelectorAll('.admin-only');

    if (user) {
        authBtn.style.display = 'none';
        userMenu.style.display = 'inline-flex';
        userMenu.textContent = user.name;
        
        if (user.role === 'admin') {
            adminOnlyElements.forEach(el => el.style.display = 'inline-block');
            userOnlyElements.forEach(el => el.style.display = 'none');
        } else {
            userOnlyElements.forEach(el => el.style.display = 'inline-block');
            adminOnlyElements.forEach(el => el.style.display = 'none');
        }
    } else {
        authBtn.style.display = 'inline-flex';
        userMenu.style.display = 'none';
        userOnlyElements.forEach(el => el.style.display = 'none');
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
}

// Initialize auth state
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = AuthManager.getCurrentUser();
    updateUIForUser(currentUser);
    
    // Set up auth form handler
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }
});