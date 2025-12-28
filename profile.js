/**
 * ResultBoom Profile Module
 */

const Profile = {
    render() {
        const app = document.getElementById('app');
        const user = Storage.getProfile();
        const lang = Storage.getLanguage();

        const T = {
            en: { title: "School Profile", back: "Back", name: "Teacher Name", contact: "Contact Number", sName: "School Name", sCode: "School Code", std: "Standard / Class", save: "Save Changes" },
            mr: { title: "शाळा प्रोफाइल", back: "मागे", name: "शिक्षकाचे नाव", contact: "संपर्क क्रमांक", sName: "शाळेचे नाव", sCode: "शाळा क्रमांक (U-DISE)", std: "इयत्ता", save: "जतन करा" }
        }[lang];

        app.innerHTML = `
            <div class="fade-in" style="max-width: 800px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="App.router('dashboard')">
                        <i class="fas fa-arrow-left"></i> ${T.back}
                    </button>
                    <h1>${T.title}</h1>
                </div>

                <div class="glass-card">
                    <form onsubmit="Profile.handleUpdate(event)">
                        <div class="grid-container" style="margin-top: 0; grid-template-columns: 1fr 1fr;">
                            <div class="form-group">
                                <label class="form-label">${T.name}</label>
                                <input type="text" id="name" class="glass-input" value="${user.name || ''}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${T.contact}</label>
                                <input type="text" id="contact" class="glass-input" value="${user.contact || ''}" placeholder="+91 98765...">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${T.sName}</label>
                            <input type="text" id="schoolName" class="glass-input" value="${user.schoolName || ''}" required>
                        </div>

                        <div class="grid-container" style="margin-top: 0; grid-template-columns: 1fr 1fr;">
                            <div class="form-group">
                                <label class="form-label">${T.sCode}</label>
                                <input type="text" id="schoolCode" class="glass-input" value="${user.schoolCode || ''}" placeholder="e.g. SCH-001">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${T.std}</label>
                                <input type="text" id="std" class="glass-input" value="${user.std || ''}" placeholder="e.g. 10th A">
                            </div>
                        </div>

                        <div style="margin-top: 20px; text-align: right;">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${T.save}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    handleUpdate(e) {
        e.preventDefault();
        const updatedData = {
            name: document.getElementById('name').value,
            contact: document.getElementById('contact').value,
            schoolName: document.getElementById('schoolName').value,
            schoolCode: document.getElementById('schoolCode').value,
            std: document.getElementById('std').value
        };

        Storage.updateProfile(updatedData);
        alert('Profile updated successfully!');
        App.router('dashboard'); // Go back to dashboard to see changes
    }
};
