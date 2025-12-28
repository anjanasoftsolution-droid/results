/**
 * ResultBoom Application Entry Point
 */

const App = {
    init() {
        this.app = document.getElementById('app');
        this.renderInitialState();
    },

    renderInitialState() {
        // Check if user is logged in
        if (Storage.isLoggedIn()) {
            this.router('dashboard');
        } else {
            this.router('login');
        }
    },

    router(route) {
        // Simple routing mechanism
        this.app.innerHTML = ''; // Clear current view

        switch (route) {
            case 'login':
                if (typeof Auth !== 'undefined') Auth.renderLogin();
                else this.showError('Auth module not loaded');
                break;
            case 'signup':
                if (typeof Auth !== 'undefined') Auth.renderSignup();
                else this.showError('Auth module not loaded');
                break;
            case 'forgot-password':
                if (typeof Auth !== 'undefined') Auth.renderForgotPass();
                else this.showError('Auth module not loaded');
                break;
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') Dashboard.render();
                else this.showPlaceholder('Dashboard');
                break;
            case 'profile':
                if (typeof Profile !== 'undefined') Profile.render();
                else this.showPlaceholder('Profile');
                break;
            case 'students':
                if (typeof Students !== 'undefined') Students.render();
                else this.showPlaceholder('Students');
                break;
            case 'exam-settings':
                if (typeof Exams !== 'undefined') Exams.render();
                else this.showPlaceholder('Exam Settings');
                break;
            case 'marks-entry':
                if (typeof Marks !== 'undefined') Marks.render();
                else this.showPlaceholder('Marks Entry');
                break;
            case 'reports':
                if (typeof Reports !== 'undefined') Reports.render();
                else this.showPlaceholder('Reports');
                break;
            default:
                this.showError('404 - Page not found');
        }
    },

    showError(msg) {
        this.app.innerHTML = `<div class="glass-card text-center" style="margin: auto; color: var(--danger);">${msg}</div>`;
    },

    showPlaceholder(title) {
        this.app.innerHTML = `
            <div class="glass-container text-center" style="padding: 50px;">
                <h1>${title}</h1>
                <p class="text-muted">Coming Soon...</p>
                <button class="btn btn-secondary mt-4" onclick="App.router('login')">Go Back</button>
            </div>
        `;
    }
};

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading time for that premium feel
    setTimeout(() => {
        App.init();
    }, 800);
});
