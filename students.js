/**
 * ResultBoom Student Management Module
 */

const Students = {
    render() {
        const app = document.getElementById('app');
        const students = Storage.getStudents();
        const lang = Storage.getLanguage();

        const T = {
            en: {
                title: "Students",
                back: "Back",
                add: "Add",
                import: "Import",
                template: "Template",
                name: "Name",
                dob: "DOB",
                contact: "Contact",
                actions: "Actions",
                noData: "No students added yet. Click 'Add' to get started.",
                modalAdd: "Add Student",
                modalEdit: "Edit Student",
                modalName: "Student Name",
                modalDOB: "Date of Birth",
                modalContact: "Contact Number",
                cancel: "Cancel",
                save: "Save",
                gender: "Gender",
                male: "Male",
                female: "Female"
            },
            mr: {
                title: "विद्यार्थी",
                back: "मागे",
                add: "नवीन जोडा",
                import: "इम्पोर्ट",
                template: "टेंप्लेट",
                name: "नाव",
                dob: "जन्म तारीख",
                contact: "संपर्क",
                actions: "क्रिया",
                noData: "विद्यार्थी नाहीत. 'नवीन जोडा' वर क्लिक करा.",
                modalAdd: "नवीन विद्यार्थी",
                modalEdit: "माहिती बदला",
                modalName: "विद्यार्थ्याचे नाव",
                modalDOB: "जन्म तारीख",
                modalContact: "संपर्क क्रमांक",
                cancel: "रद्द करा",
                save: "जतन करा",
                gender: "लिंग",
                male: "मुलगा",
                female: "मुलगी"
            }
        }[lang];

        // Make T available globally for modals if needed, or re-access in helpers
        this.T = T;

        // Generate table rows
        const rows = students.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.dob}</td>
                <td>${s.contact}</td>
                <td style="text-align: right;">
                    <button class="btn btn-secondary" onclick="Students.openEditModal('${s.id}')" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 5px;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="Students.deleteStudent('${s.id}')" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        const emptyState = `
            <tr>
                <td colspan="4" class="text-center text-muted" style="padding: 40px;">
                    ${T.noData}
                </td>
            </tr>
        `;

        app.innerHTML = `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="btn btn-secondary" onclick="App.router('dashboard')">
                            <i class="fas fa-arrow-left"></i> ${T.back}
                        </button>
                        <h1>${T.title}</h1>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <input type="file" id="studentImportFile" accept=".xlsx, .xls" style="display: none;" onchange="Students.handleImport(this)">
                        
                        <button class="btn btn-secondary" onclick="Students.downloadTemplate()" title="Download Excel Template">
                            <i class="fas fa-file-excel"></i> ${T.template}
                        </button>
                        <button class="btn btn-secondary" onclick="document.getElementById('studentImportFile').click()" title="Import from Excel">
                            <i class="fas fa-file-upload"></i> ${T.import}
                        </button>
                        <button class="btn btn-primary" onclick="Students.openAddModal()">
                            <i class="fas fa-plus"></i> ${T.add}
                        </button>
                    </div>
                </div>

                <div class="glass-card" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
                                <th style="padding: 15px;">${T.name}</th>
                                <th style="padding: 15px;">${T.dob}</th>
                                <th style="padding: 15px;">${T.contact}</th>
                                <th style="padding: 15px; text-align: right;">${T.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.length > 0 ? rows : emptyState}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal Backdrop -->
            <div id="studentModal" class="modal-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 100; align-items: center; justify-content: center;">
                <div class="glass-card" style="width: 90%; max-width: 500px; animation: fadeIn 0.3s;">
                    <h2 id="modalTitle" style="margin-bottom: 20px;">${T.modalAdd}</h2>
                    <form onsubmit="Students.handleSave(event)">
                        <input type="hidden" id="studentId">
                        
                        <div class="form-group">
                            <label class="form-label">${T.modalName}</label>
                            <input type="text" id="stdName" class="glass-input" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${T.gender}</label>
                            <select id="stdGender" class="glass-input">
                                <option value="Male">${T.male}</option>
                                <option value="Female">${T.female}</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${T.modalDOB}</label>
                            <input type="date" id="stdDob" class="glass-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${T.modalContact}</label>
                            <input type="text" id="stdContact" class="glass-input" placeholder="+91..." required>
                        </div>
                        
                        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                            <button type="button" class="btn btn-secondary" onclick="Students.closeModal()">${T.cancel}</button>
                            <button type="submit" class="btn btn-primary">${T.save}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    openAddModal() {
        document.getElementById('studentModal').style.display = 'flex';
        document.getElementById('modalTitle').innerText = this.T ? this.T.modalAdd : 'Add Student';
        document.getElementById('studentId').value = '';
        document.getElementById('stdName').value = '';
        document.getElementById('stdGender').value = 'Male';
        document.getElementById('stdDob').value = '';
        document.getElementById('stdContact').value = '';
    },

    openEditModal(id) {
        const students = Storage.getStudents();
        const student = students.find(s => s.id === id);
        if (!student) return;

        document.getElementById('studentModal').style.display = 'flex';
        document.getElementById('modalTitle').innerText = this.T ? this.T.modalEdit : 'Edit Student';
        document.getElementById('studentId').value = student.id;
        document.getElementById('stdName').value = student.name;
        document.getElementById('stdGender').value = student.gender || 'Male';
        document.getElementById('stdDob').value = student.dob;
        document.getElementById('stdContact').value = student.contact;
    },

    closeModal() {
        document.getElementById('studentModal').style.display = 'none';
    },

    handleSave(e) {
        e.preventDefault();
        const id = document.getElementById('studentId').value;
        const student = {
            id: id || null,
            name: document.getElementById('stdName').value,
            gender: document.getElementById('stdGender').value,
            dob: document.getElementById('stdDob').value,
            contact: document.getElementById('stdContact').value
        };

        Storage.saveStudent(student);
        this.closeModal();
        this.render(); // Re-render list
    },

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            Storage.deleteStudent(id);
            this.render();
        }
    },

    downloadTemplate() {
        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet([
            { "Name": "John Doe", "Gender": "Male", "DOB": "2015-05-15", "Contact": "9876543210" },
            { "Name": "Jane Smith", "Gender": "Female", "DOB": "2016-02-20", "Contact": "9123456780" }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "Student_Template.xlsx");
    },

    handleImport(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                let addedCount = 0;
                jsonData.forEach(row => {
                    if (row.Name && row.DOB) {
                        Storage.saveStudent({
                            id: Date.now().toString() + Math.floor(Math.random() * 1000),
                            name: row.Name,
                            gender: row.Gender || 'Male',
                            dob: row.DOB,
                            contact: row.Contact || ''
                        });
                        addedCount++;
                    }
                });

                alert(`Successfully imported ${addedCount} students!`);
                this.render();
            } catch (err) {
                console.error(err);
                alert('Error processing file. Please ensure it matches the template.');
            }
        };
        reader.readAsArrayBuffer(file);

        // Reset input
        input.value = '';
    }
};
