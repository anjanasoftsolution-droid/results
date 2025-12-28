/**
 * ResultBoom Storage Manager
 * Handles all localStorage interactions
 */

const DB_KEYS = {
    USER: 'rb_user', // Current logged in user (teacher profile)
    STUDENTS: 'rb_students',
    EXAMS: 'rb_exams', // Subject settings, max marks
    MARKS: 'rb_marks',
    AUTH_TOKEN: 'rb_is_logged_in',
    LANG: 'rb_language' // 'en' or 'mr'
};

const Storage = {
    // --- Language ---
    getLanguage() {
        return localStorage.getItem(DB_KEYS.LANG) || 'en';
    },

    setLanguage(lang) {
        localStorage.setItem(DB_KEYS.LANG, lang);
    },

    // --- Auth ---

    login(email, password) {
        // Mock login - in reality, we'd check against a user DB
        // For this local-only app, we'll just set a flag if "credential" matches or if it's first run
        const user = this.getProfile();

        if (!user) {
            // First time logic handled in signup
            return { success: false, message: 'User not found. Please sign up.' };
        }

        if (user.email === email && user.password === password) {
            localStorage.setItem(DB_KEYS.AUTH_TOKEN, 'true');
            return { success: true };
        }

        return { success: false, message: 'Invalid credentials' };
    },

    signup(profileData) {
        // profileData: { email, password, schoolName, ... }
        if (this.getProfile()) {
            return { success: false, message: 'Account already exists. Please login.' };
        }
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(profileData));
        localStorage.setItem(DB_KEYS.AUTH_TOKEN, 'true');
        return { success: true };
    },

    logout() {
        localStorage.removeItem(DB_KEYS.AUTH_TOKEN);
    },

    isLoggedIn() {
        return localStorage.getItem(DB_KEYS.AUTH_TOKEN) === 'true';
    },

    // --- Profile ---

    getProfile() {
        const data = localStorage.getItem(DB_KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    updateProfile(data) {
        const current = this.getProfile() || {};
        const updated = { ...current, ...data };
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(updated));
        return updated;
    },

    // --- Students ---

    getStudents() {
        const data = localStorage.getItem(DB_KEYS.STUDENTS);
        return data ? JSON.parse(data) : [];
    },

    saveStudent(student) {
        const students = this.getStudents();
        if (student.id) {
            // Update
            const index = students.findIndex(s => s.id === student.id);
            if (index !== -1) students[index] = student;
        } else {
            // Add
            student.id = Date.now().toString();
            students.push(student);
        }
        localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
        return student;
    },

    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== id);
        localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
    },

    // --- Exams/Settings ---

    getExamSettings() {
        const data = localStorage.getItem(DB_KEYS.EXAMS);
        return data ? JSON.parse(data) : { subjects: [], settings: {} };
    },

    saveExamSettings(settings) {
        localStorage.setItem(DB_KEYS.EXAMS, JSON.stringify(settings));
    },

    // --- Marks ---

    getMarks() {
        const data = localStorage.getItem(DB_KEYS.MARKS);
        return data ? JSON.parse(data) : {}; // structure: { studentId: { sem1: { subjectId: marks }, sem2: ... } }
    },

    saveMarks(studentId, semester, subjectId, marks) {
        // Legacy support or direct total overwrite
        const allMarks = this.getMarks();
        if (!allMarks[studentId]) allMarks[studentId] = {};
        if (!allMarks[studentId][semester]) allMarks[studentId][semester] = {};

        allMarks[studentId][semester][subjectId] = marks;
        localStorage.setItem(DB_KEYS.MARKS, JSON.stringify(allMarks));
    },

    saveComponentMark(studentId, term, subjectId, type, value) {
        // type = 'fa', 'sa_oral', 'sa_written'
        const allMarks = this.getMarks();
        if (!allMarks[studentId]) allMarks[studentId] = {};
        if (!allMarks[studentId][term]) allMarks[studentId][term] = {};
        if (!allMarks[studentId][term][subjectId]) allMarks[studentId][term][subjectId] = {};

        // If previous data was just a number (legacy), convert to object or reset
        if (typeof allMarks[studentId][term][subjectId] !== 'object') {
            allMarks[studentId][term][subjectId] = {};
        }

        allMarks[studentId][term][subjectId][type] = value;
        localStorage.setItem(DB_KEYS.MARKS, JSON.stringify(allMarks));
    }
};
