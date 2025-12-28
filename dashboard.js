/**
 * ResultBoom Dashboard Module
 */

const Dashboard = {
    render() {
        const app = document.getElementById('app');
        const user = Storage.getProfile();
        const students = Storage.getStudents();
        const studentCount = students.length;
        const lang = Storage.getLanguage(); // 'en' or 'mr'

        // Localization Dictionary
        const T = {
            en: {
                welcome: "Welcome back",
                overview: "Stats Overview",
                totalStudents: "Total Students",
                manage: "Manage Students",
                schoolCode: "School Code",
                notSet: "Not Set",
                standard: "Standard",
                quickActions: "Quick Actions",
                profile: "School Profile",
                profileDesc: "Update school details",
                students: "Students",
                studentsDesc: "Add, remove, update",
                exams: "Exam Settings",
                examsDesc: "Subjects & Criteria",
                marks: "Enter Marks",
                marksDesc: "Sem 1 & Sem 2",
                reports: "Reports",
                reportsDesc: "Generate Results",
                logout: "Logout",
                toggle: "मराठी",
                view: "View"
            },
            mr: {
                welcome: "स्वागत आहे",
                overview: "सारांश",
                totalStudents: "एकूण विद्यार्थी",
                manage: "विद्यार्थी व्यवस्थापन",
                schoolCode: "शाळा क्रमांक",
                notSet: "सेट नाही",
                standard: "इयत्ता",
                quickActions: "क्विक ॲक्शन्स",
                profile: "शाळा माहिती",
                profileDesc: "शाळेची माहिती अपडेट करा",
                students: "विद्यार्थी",
                studentsDesc: "नवीन जोडा, बदला",
                exams: "परीक्षा सेटिंग्ज",
                examsDesc: "विषय आणि निकष",
                marks: "गुण भरा",
                marksDesc: "सत्र 1 आणि सत्र 2",
                reports: "निकाल पत्रक",
                reportsDesc: "प्रगती पुस्तक बनवा",
                logout: "बाहेर पडा",
                toggle: "English",
                view: "पहा"
            }
        }[lang];

        app.innerHTML = `
            <div class="fade-in">
                <!-- Header -->
                <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <div>
                        <h1 style="font-size: 2rem;">${T.overview}</h1>
                        <p class="text-muted">${T.welcome}, ${user.name}</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" onclick="Dashboard.toggleLanguage()">
                            <i class="fas fa-language"></i> ${T.toggle}
                        </button>
                        <button class="btn btn-secondary" onclick="Dashboard.logout()">
                            <i class="fas fa-sign-out-alt"></i> ${T.logout}
                        </button>
                    </div>
                </header>

                <!-- Stats Cards -->
                <div class="grid-container">
                    <div class="glass-card" style="background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.2)); border-color: rgba(99,102,241,0.3);">
                        <div class="text-muted text-sm">${T.totalStudents}</div>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">${studentCount}</div>
                        <div class="text-sm mt-4 text-primary" style="cursor: pointer;" onclick="App.router('students')">${T.manage} &rarr;</div>
                    </div>
                    
                    <div class="glass-card">
                        <div class="text-muted text-sm">${T.schoolCode}</div>
                        <div style="font-size: 1.5rem; font-weight: 600;">${user.schoolCode || T.notSet}</div>
                        <div class="text-sm mt-4 text-muted">${T.standard}: ${user.std || T.notSet}</div>
                    </div>
                </div>

                <!-- Navigation Grid -->
                <h3 class="mt-4 mb-4">${T.quickActions}</h3>
                <div class="grid-container">
                    <div class="glass-card hover-card" onclick="App.router('profile')" style="cursor: pointer; text-align: center;">
                        <div style="font-size: 2rem; color: var(--secondary); margin-bottom: 15px;">
                            <i class="fas fa-school"></i>
                        </div>
                        <h3>${T.profile}</h3>
                        <p class="text-muted text-sm">${T.profileDesc}</p>
                    </div>

                    <div class="glass-card hover-card" onclick="App.router('students')" style="cursor: pointer; text-align: center;">
                        <div style="font-size: 2rem; color: var(--accent); margin-bottom: 15px;">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <h3>${T.students}</h3>
                        <p class="text-muted text-sm">${T.studentsDesc}</p>
                    </div>

                     <div class="glass-card hover-card" onclick="App.router('exam-settings')" style="cursor: pointer; text-align: center;">
                        <div style="font-size: 2rem; color: var(--warning); margin-bottom: 15px;">
                            <i class="fas fa-cog"></i>
                        </div>
                        <h3>${T.exams}</h3>
                         <p class="text-muted text-sm">${T.examsDesc}</p>
                    </div>

                    <div class="glass-card hover-card" onclick="App.router('marks-entry')" style="cursor: pointer; text-align: center;">
                        <div style="font-size: 2rem; color: var(--success); margin-bottom: 15px;">
                            <i class="fas fa-edit"></i>
                        </div>
                        <h3>${T.marks}</h3>
                        <p class="text-muted text-sm">${T.marksDesc}</p>
                    </div>
                    
                    <div class="glass-card hover-card" onclick="App.router('reports')" style="cursor: pointer; text-align: center;">
                        <div style="font-size: 2rem; color: #38bdf8; margin-bottom: 15px;">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h3>${T.reports}</h3>
                        <p class="text-muted text-sm">${T.reportsDesc}</p>
                    </div>
                </div>
            </div>
        `;
    },

    toggleLanguage() {
        const current = Storage.getLanguage();
        const newLang = current === 'en' ? 'mr' : 'en';
        Storage.setLanguage(newLang);
        App.router('dashboard'); // Reload to reflect changes
    },

    logout() {
        Storage.logout();
        App.router('login');
    }
};
