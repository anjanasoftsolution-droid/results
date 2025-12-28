/**
 * ResultBoom Authentication Module
 */

const Auth = {
    renderLogin() {
        const app = document.getElementById('app');
        // Auth is tricky because language might not be set if not logged in.
        // We will default to 'en', but allow a toggle if we wanted. 
        // For now let's assume standard 'en' for auth or check storage if it persists.
        const lang = Storage.getLanguage();

        const T = {
            en: { title: "Welcome Back", sub: "Sign in to manage your school results", email: "Email Address", pass: "Password", forgot: "Forgot Password?", signin: "Sign In", new: "New here?", create: "Create an account" },
            mr: { title: "स्वागत आहे", sub: "निकाल व्यवस्थापित करण्यासाठी लॉगिन करा", email: "ई-मेल पत्ता", pass: "पासवर्ड", forgot: "पासवर्ड विसरलात?", signin: "लॉगिन करा", new: "नवीन आहात?", create: "नवीन खाते उघडा" }
        }[lang];

        app.innerHTML = `
            <div class="auth-container fade-in">
                <h1 class="auth-title">${T.title}</h1>
                <p class="text-muted mb-4">${T.sub}</p>
                
                <div class="glass-card">
                    <form onsubmit="Auth.handleLogin(event)">
                        <div class="form-group">
                            <label class="form-label">${T.email}</label>
                            <input type="email" id="email" class="glass-input" placeholder="teacher@school.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${T.pass}</label>
                            <input type="password" id="password" class="glass-input" placeholder="••••••••" required>
                        </div>
                        
                        <div class="form-group" style="text-align: right;">
                            <a href="#" onclick="App.router('forgot-password'); return false;" class="text-sm text-primary">${T.forgot}</a>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" style="justify-content: center;">
                            ${T.signin} <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center text-sm">
                        <span class="text-muted">${T.new}</span>
                        <a href="#" onclick="App.router('signup'); return false;" class="text-primary">${T.create}</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderSignup() {
        const app = document.getElementById('app');
        const lang = Storage.getLanguage();
        const T = {
            en: { title: "Get Started", sub: "Create your teacher profile", name: "Full Name", email: "Email Address", pass: "Password", sName: "School Name", create: "Create Account", have: "Already have an account?", signin: "Sign In" },
            mr: { title: "सुरुवात करा", sub: "आपले शिक्षक प्रोफाइल तयार करा", name: "पूर्ण नाव", email: "ई-मेल पत्ता", pass: "पासवर्ड (नवीन)", sName: "शाळेचे नाव", create: "खाते तयार करा", have: "खाते आधीच आहे?", signin: "लॉगिन करा" }
        }[lang];

        app.innerHTML = `
            <div class="auth-container fade-in">
                <h1 class="auth-title">${T.title}</h1>
                <p class="text-muted mb-4">${T.sub}</p>
                
                <div class="glass-card">
                    <form onsubmit="Auth.handleSignup(event)">
                        <div class="form-group">
                            <label class="form-label">${T.name}</label>
                            <input type="text" id="name" class="glass-input" placeholder="John Doe" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${T.email}</label>
                            <input type="email" id="email" class="glass-input" placeholder="teacher@school.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${T.pass}</label>
                            <input type="password" id="password" class="glass-input" placeholder="Create a password" required>
                        </div>

                        <!-- Initial School Details -->
                        <div class="form-group">
                             <label class="form-label">${T.sName}</label>
                             <input type="text" id="schoolName" class="glass-input" placeholder="St. Mary's High School" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" style="justify-content: center;">
                            ${T.create}
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center text-sm">
                        <span class="text-muted">${T.have}</span>
                        <a href="#" onclick="App.router('login'); return false;" class="text-primary">${T.signin}</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderForgotPass() {
        const app = document.getElementById('app');
        const lang = Storage.getLanguage();
        const T = {
            en: { title: "Recovery", sub: "Enter your email to reset password", email: "Email Address", send: "Send Reset Link", back: "Back to Login" },
            mr: { title: "रिकव्हरी", sub: "पासवर्ड रिसेट करण्यासाठी ई-मेल टाका", email: "ई-मेल पत्ता", send: "लिंक पाठवा", back: "लॉगिन कडे परत" }
        }[lang];

        app.innerHTML = `
            <div class="auth-container fade-in">
                <h1 class="auth-title">${T.title}</h1>
                <p class="text-muted mb-4">${T.sub}</p>
                
                <div class="glass-card">
                    <form onsubmit="Auth.handleForgotPass(event)">
                        <div class="form-group">
                            <label class="form-label">${T.email}</label>
                            <input type="email" id="email" class="glass-input" placeholder="teacher@school.com" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" style="justify-content: center;">
                            ${T.send}
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center text-sm">
                        <a href="#" onclick="App.router('login'); return false;" class="text-primary">${T.back}</a>
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = Storage.login(email, password);

        if (result.success) {
            App.router('dashboard');
        } else {
            alert(result.message); // In a real app, use a toast
        }
    },

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const schoolName = document.getElementById('schoolName').value;

        const result = Storage.signup({
            name,
            email,
            password,
            schoolName,
            // Defaults
            schoolCode: '',
            contact: '',
            std: ''
        });

        if (result.success) {
            App.router('dashboard');
        } else {
            alert(result.message);
        }
    },

    handleForgotPass(e) {
        e.preventDefault();
        alert('Password reset link sent (simulated). Please login with your existing password.');
        App.router('login');
    }
};
