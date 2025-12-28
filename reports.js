/**
 * ResultBoom Reports Module (Multi-Language)
 */

const Reports = {
    render() {
        const lang = Storage.getLanguage(); // 'en' or 'mr'
        if (lang === 'mr') this.renderMr();
        else this.renderEn();
    },

    generateCard(studentId) {
        const lang = Storage.getLanguage();
        if (lang === 'mr') this.generateCardMr(studentId);
        else this.generateCardEn(studentId);
    },

    // ==========================================
    // ENGLISH RENDERER
    // ==========================================
    renderEn() {
        const app = document.getElementById('app');
        const students = Storage.getStudents();

        const list = students.map(s => `
            <div class="glass-card hover-card" onclick="Reports.generateCard('${s.id}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px;">
                <div>
                    <h3 style="margin-bottom: 5px;">${s.name}</h3>
                    <p class="text-muted text-sm">Roll No: ${s.id.substring(0, 6)}</p>
                </div>
                <div style="text-align: right;">
                    <i class="fas fa-chevron-right text-primary"></i>
                </div>
            </div>
        `).join('');

        app.innerHTML = `
            <div class="fade-in" style="max-width: 800px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="App.router('dashboard')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1>Student Reports (English)</h1>
                </div>
                
                <p class="text-muted mb-4">Select a student to generate the Report Card.</p>
                
                 <div class="glass-card mb-4" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; justify-content: space-between; align-items: center; padding: 15px;">
                     <div>
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary);">Master Result Sheet</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.8;">View and print the complete class result.</p>
                    </div>
                    <button class="btn btn-primary" onclick="ResultSheet.render()">
                        <i class="fas fa-table"></i> View Sheet
                    </button>
                </div>

                <div class="student-list">
                    ${students.length > 0 ? list : '<div class="text-center text-muted">No students found.</div>'}
                </div>
            </div>
        `;
    },

    renderMr() {
        const app = document.getElementById('app');
        const students = Storage.getStudents();

        const list = students.map(s => `
            <div class="glass-card hover-card" onclick="Reports.generateCard('${s.id}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px;">
                <div>
                    <h3 style="margin-bottom: 5px;">${s.name}</h3>
                    <p class="text-muted text-sm">हजेरी क्र: ${s.id.substring(0, 6)}</p>
                </div>
                <div style="text-align: right;">
                    <i class="fas fa-chevron-right text-primary"></i>
                </div>
            </div>
        `).join('');

        app.innerHTML = `
            <div class="fade-in" style="max-width: 800px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="App.router('dashboard')">
                        <i class="fas fa-arrow-left"></i> मागे
                    </button>
                    <h1>विद्यार्थी प्रगती (मराठी)</h1>
                </div>
                
                <p class="text-muted mb-4">प्रगती पुस्तक पाहण्यासाठी विद्यार्थ्याचे नाव निवडा.</p>
                
                 <div class="glass-card mb-4" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; justify-content: space-between; align-items: center; padding: 15px;">
                     <div>
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary);">एकत्रित निकाल पत्रक</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.8;">सपूर्ण वर्गाचा निकाल पहा.</p>
                    </div>
                    <button class="btn btn-primary" onclick="ResultSheet.render()">
                        <i class="fas fa-table"></i> निकाल पत्रक
                    </button>
                </div>

                <div class="student-list">
                    ${students.length > 0 ? list : '<div class="text-center text-muted">विद्यार्थी सापडले नाहीत.</div>'}
                </div>
            </div>
        `;
    },

    // ==========================================
    // SHARED LOGIC
    // ==========================================
    getSubjectData(studentId, term, subId, subType) {
        const settings = Storage.getExamSettings();
        const allMarks = Storage.getMarks();

        const configKey = subType.replace('-', '_');
        const typeConfig = settings.granularMarks ? settings.granularMarks[configKey] : null;
        const config = typeConfig ? typeConfig[term] : null;

        if (!config) return { total: '', grade: '' };

        const marksData = (allMarks[studentId] && allMarks[studentId][term] && allMarks[studentId][term][subId]) || {};

        let obtained = 0;
        let maxMarks = 0;

        // FA
        ['fa_oral', 'fa_project', 'fa_activity', 'fa_practical', 'fa_test', 'fa_homework', 'fa_other'].forEach(k => {
            if (config[k] > 0) {
                obtained += parseFloat(marksData[k] || 0);
                maxMarks += config[k];
            }
        });

        // SA (if scholastic)
        if (subType === 'scholastic') {
            ['sa_oral', 'sa_practical', 'sa_written'].forEach(k => {
                if (config[k] > 0) {
                    obtained += parseFloat(marksData[k] || 0);
                    maxMarks += config[k];
                }
            });
        }

        if (maxMarks === 0) return { total: '', grade: '' };

        const percentage = (obtained / maxMarks) * 100;
        const grade = (typeof Grading !== 'undefined' ? Grading.calculateGrade(percentage).grade : '-');

        return { total: obtained, grade };
    },

    // ==========================================
    // ENGLISH CARD
    // ==========================================
    generateCardEn(studentId) {
        this._generateCardGeneric(studentId, {
            labels: {
                schoolName: "School Name",
                reportTitle: "Progress Report",
                personal: "Personal Details",
                name: "Name",
                std: "Std",
                div: "Div",
                roll: "Roll No",
                gr: "GR No",
                dob: "DOB",
                addr: "Address",
                health: "Health Record",
                height: "Height (cm)",
                weight: "Weight (kg)",
                vision: "Vision",
                dental: "Dental",
                attend: "Attendance (Days Present)",
                month: "Month",
                working: "Working",
                present: "Present",
                key: "Performance Key",
                marks: "Marks",
                grade: "Grade",
                resultDate: "Result Date",
                sem1: "First Semester",
                sem2: "Second Semester",
                detail: "Detail",
                subject: "Subject",
                no: "No",
                strong: "Special Progress / Strong Work",
                hobby: "Interest / Hobbies (Aavad)",
                improve: "Improvements Needed",
                sigClass: "Class Teacher",
                sigHead: "Headmaster",
                sigParent: "Parent",
                impNote: "* E Grade indicates 'Improvement Needed'"
            }
        });
    },

    // ==========================================
    // MARATHI CARD
    // ==========================================
    generateCardMr(studentId) {
        this._generateCardGeneric(studentId, {
            labels: {
                schoolName: "शाळेचे नाव",
                reportTitle: "विद्यार्थी प्रगती पुस्तक",
                personal: "वैयक्तिक माहिती",
                name: "विद्यार्थी नाव",
                std: "इयत्ता",
                div: "तुकडी",
                roll: "हजेरी क्र.",
                gr: "जी.आर. क्र.",
                dob: "जन्म तारीख",
                addr: "पत्ता",
                health: "आरोग्य नोंद",
                height: "उंची (सेमी)",
                weight: "वजन (किग्रॅ)",
                vision: "दृष्टी",
                dental: "दंत तपासणी",
                attend: "उपस्थिती (महिन्यानुसार)",
                month: "महिना",
                working: "कामाचे दिवस",
                present: "उपस्थित दिवस",
                key: "श्रेणी तक्ता",
                marks: "गुण",
                grade: "श्रेणी",
                resultDate: "निकाल दिनांक",
                sem1: "प्रथम सत्र",
                sem2: "द्वितीय सत्र",
                detail: "तपशील",
                subject: "विषय",
                no: "क्र.",
                strong: "विशेष प्रगती / छंद",
                hobby: "आवड (Hobbies)",
                improve: "सुधारणा आवश्यक",
                sigClass: "वर्ग शिक्षक",
                sigHead: "मुख्याध्यापक",
                sigParent: "पालक",
                impNote: "* 'E' श्रेणी म्हणजे सुधारणेची गरज"
            }
        });
    },


    // ==========================================
    // GENERIC GENERATOR (Template)
    // ==========================================
    _generateCardGeneric(studentId, config) {
        try {
            const app = document.getElementById('app');
            const student = Storage.getStudents().find(s => s.id === studentId);
            const profile = Storage.getProfile();
            const settings = Storage.getExamSettings();
            const subjects = settings.subjects || [];
            const L = config.labels;

            if (!student) throw new Error("Student not found.");

            // Helpers
            const renderRemarkField = (label, lines = 1) => {
                let html = `<div class="remark-field"><span class="remark-label">${label}:</span>`;
                for (let i = 0; i < lines; i++) html += `<div class="remark-line"></div>`;
                html += `</div>`;
                return html;
            };

            const renderSigBlock = (title) => {
                return `
                    <div class="sig-block">
                        <div class="sig-line"></div>
                        <span class="sig-text">${title}</span>
                    </div>
                `;
            };

            // Calculate Grades
            const subjectRows = subjects.map((sub, idx) => {
                const t1 = this.getSubjectData(studentId, 't1', sub.id, sub.type || 'scholastic');
                const t2 = this.getSubjectData(studentId, 't2', sub.id, sub.type || 'scholastic');
                return { sr: idx + 1, name: sub.name, t1Grade: t1.grade, t2Grade: t2.grade };
            });

            // Styling variables
            const themeColor = "#2c3e50";
            const accentColor = "#ecf0f1";
            const textColor = "#2d3436";

            const fieldStyle = `border-bottom: 2px dotted ${themeColor}; font-weight: bold; width: 100%; display:inline-block; text-align: center; color: ${textColor}; min-height: 20px;`;
            const labelStyle = `font-weight: 600; margin-right: 5px; font-size: 0.85rem; color: ${themeColor}; white-space: nowrap;`;

            app.innerHTML = `
                <div class="fade-in">
                    <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <button class="btn btn-secondary" onclick="Reports.render()">
                            <i class="fas fa-arrow-left"></i> ${L.no === 'No' ? 'Back' : 'मागे'}
                        </button>
                        <button class="btn btn-primary" onclick="window.print()">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>

                    <!-- CONTAINER -->
                    <div class="report-wrapper">
                        
                        <!-- PAGE 1 -->
                        <div class="landscape-page">
                            
                            <!-- PART 2: Attendance (Moving to Left / Back Page) -->
                            <div class="panel">
                                <div class="panel-border">
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="text-align: center; margin: 0 0 10px 0; color: ${themeColor}; text-decoration: underline;">${L.attend}</h4>
                                        <table class="mh-table" style="font-size: 0.75rem;">
                                            <tr>
                                                <th style="width: 20%;">${L.month}</th>
                                                <th>Jun</th><th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th>
                                            </tr>
                                            <tr>
                                                <td>${L.working}</td>
                                                <td>24</td><td>25</td><td>23</td><td>24</td><td>18</td><td>20</td><td>25</td><td>24</td><td>23</td><td>24</td><td>15</td>
                                            </tr>
                                            <tr>
                                                <td>${L.present}</td>
                                                 <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div style="margin-bottom: 20px;">
                                        <h4 style="text-align: center; margin: 0 0 10px 0; color: ${themeColor}; text-decoration: underline;">${L.key}</h4>
                                        <div style="display: flex; justify-content: space-around; gap: 10px;">
                                            <table class="mh-table" style="width: 48%; font-size: 0.8rem;">
                                                <tr><th>${L.marks}</th> <th>${L.grade}</th></tr>
                                                <tr><td>91 - 100</td> <td class="grade-cell">A1</td></tr>
                                                <tr><td>81 - 90</td> <td class="grade-cell">A2</td></tr>
                                                <tr><td>71 - 80</td> <td class="grade-cell">B1</td></tr>
                                                <tr><td>61 - 70</td> <td class="grade-cell">B2</td></tr>
                                            </table>
                                            <table class="mh-table" style="width: 48%; font-size: 0.8rem;">
                                                <tr><th>${L.marks}</th> <th>${L.grade}</th></tr>
                                                <tr><td>51 - 60</td> <td class="grade-cell">C1</td></tr>
                                                <tr><td>41 - 50</td> <td class="grade-cell">C2</td></tr>
                                                <tr><td>33 - 40</td> <td class="grade-cell">D</td></tr>
                                                <tr><td>00 - 32</td> <td class="grade-cell">E</td></tr>
                                            </table>
                                        </div>
                                        <div style="margin-top: 5px; font-size: 0.75rem; text-align: center; color: #e74c3c;">
                                            <em>${L.impNote}</em>
                                        </div>
                                    </div>

                                    <div style="text-align: center; margin-top: auto; border: 1px dashed #bdc3c7; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                                        <strong style="color: ${themeColor};">${L.resultDate}:</strong> ________________
                                    </div>
                                </div>
                            </div>

                            <!-- PART 1: Personal (Moving to Right / Front Page) -->
                            <div class="panel">
                                <div class="panel-border">
                                    <div style="text-align: center; margin-bottom: 15px;">
                                        <h2 style="font-size: 1.6rem; margin: 0; text-transform: uppercase; color: ${themeColor}; border-bottom: 2px solid ${themeColor}; display: inline-block;">${profile.schoolName || L.schoolName}</h2>
                                        <h3 style="margin: 5px 0 0 0; font-size: 1.1rem; color: #555;">${L.reportTitle}</h3>
                                    </div>

                                    <div style="margin-bottom: 15px; background: #fff;">
                                        <h4 style="background: ${themeColor}; color: white; padding: 5px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px; font-size: 0.9rem;">${L.personal}</h4>
                                        <div style="display: flex; flex-direction: column; gap: 8px;">
                                            <div style="display: flex; align-items: baseline;"><span class="${labelStyle}" style="min-width: 60px;">${L.name}:</span> <span style="${fieldStyle} text-align: left; padding-left: 5px;">${student.name}</span></div>
                                            
                                            <div style="display: flex; gap: 15px;">
                                                <div style="flex: 1; display:flex; align-items:baseline;"><span class="${labelStyle}">${L.std}:</span> <span style="${fieldStyle}">${profile.std || '-'}</span></div>
                                                <div style="flex: 1; display:flex; align-items:baseline;"><span class="${labelStyle}">${L.div}:</span> <span style="${fieldStyle}">-</span></div>
                                            </div>
                                            <div style="display: flex; gap: 15px;">
                                                <div style="flex: 1; display:flex; align-items:baseline;"><span class="${labelStyle}">${L.roll}:</span> <span style="${fieldStyle}">${student.id.substring(0, 4)}</span></div>
                                                <div style="flex: 1; display:flex; align-items:baseline;"><span class="${labelStyle}">${L.gr}:</span> <span style="${fieldStyle}">${student.id.substring(4, 10)}</span></div>
                                            </div>
                                            
                                            <div style="display: flex; align-items: baseline;"><span class="${labelStyle}">${L.dob}:</span> <span style="${fieldStyle} width: 50%;">${student.dob}</span></div>
                                            <div style="display: flex; align-items: baseline;"><span class="${labelStyle}">${L.addr}:</span> <span style="${fieldStyle} text-align: left; padding-left: 5px;">${student.contact || ''}</span></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style="background: ${themeColor}; color: white; padding: 5px 10px; border-radius: 4px; display: inline-block; margin-bottom: 5px; font-size: 0.9rem;">${L.health}</h4>
                                        <table class="mh-table">
                                            <tr><th>${L.detail}</th> <th>${L.sem1}</th> <th>${L.sem2}</th></tr>
                                            <tr><td>${L.height}</td> <td></td> <td></td></tr>
                                            <tr><td>${L.weight}</td> <td></td> <td></td></tr>
                                            <tr><td>${L.vision}</td> <td></td> <td></td></tr>
                                            <tr><td>${L.dental}</td> <td></td> <td></td></tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- PAGE 2 -->
                        <div class="landscape-page">
                            
                            <!-- PART 3: Sem 1 -->
                            <div class="panel">
                                <div class="panel-border">
                                    <h3 style="text-align: center; margin-top: 0; padding-bottom: 5px; border-bottom: 2px solid ${themeColor}; color: ${themeColor};">${L.sem1}</h3>
                                    
                                    <table class="mh-table" style="font-size: 0.9rem;">
                                        <thead>
                                            <tr>
                                                <th style="width: 50px;">${L.no}</th>
                                                <th>${L.subject}</th>
                                                <th style="width: 80px;">${L.grade}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${subjectRows.map(row => `
                                                <tr>
                                                    <td style="text-align: center;">${row.sr}</td>
                                                    <td style="text-align: left; padding-left: 8px;">${row.name}</td>
                                                    <td style="text-align: center; font-weight: bold; color: ${themeColor};">${row.t1Grade}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>

                                    <div style="margin-top: 15px;">
                                        ${renderRemarkField(L.strong, 1)}
                                        ${renderRemarkField(L.hobby, 1)}
                                        ${renderRemarkField(L.improve, 1)}
                                    </div>

                                    <div style="margin-top: auto; padding-top: 20px; display: flex; justify-content: space-between; text-align: center;">
                                        ${renderSigBlock(L.sigClass)}
                                        ${renderSigBlock(L.sigHead)}
                                        ${renderSigBlock(L.sigParent)}
                                    </div>
                                </div>
                            </div>

                            <!-- PART 4: Sem 2 -->
                            <div class="panel">
                                <div class="panel-border">
                                    <h3 style="text-align: center; margin-top: 0; padding-bottom: 5px; border-bottom: 2px solid ${themeColor}; color: ${themeColor};">${L.sem2}</h3>
                                    
                                    <table class="mh-table" style="font-size: 0.9rem;">
                                        <thead>
                                            <tr>
                                                <th style="width: 50px;">${L.no}</th>
                                                <th>${L.subject}</th>
                                                <th style="width: 80px;">${L.grade}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${subjectRows.map(row => `
                                                <tr>
                                                    <td style="text-align: center;">${row.sr}</td>
                                                    <td style="text-align: left; padding-left: 8px;">${row.name}</td>
                                                    <td style="text-align: center; font-weight: bold; color: ${themeColor};">${row.t2Grade}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>

                                    <div style="margin-top: 15px;">
                                        ${renderRemarkField(L.strong, 1)}
                                        ${renderRemarkField(L.hobby, 1)}
                                        ${renderRemarkField(L.improve, 1)}
                                    </div>

                                    <div style="margin-top: auto; padding-top: 20px; display: flex; justify-content: space-between; text-align: center;">
                                        ${renderSigBlock(L.sigClass)}
                                        ${renderSigBlock(L.sigHead)}
                                        ${renderSigBlock(L.sigParent)}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <style>
                     /* Report Base */
                    .report-wrapper {
                        background: #fdfdfd; 
                        color: ${textColor};
                        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    }
                    
                    /* Page Layout */
                    .landscape-page {
                        width: 297mm;
                        height: 210mm;
                        background: white;
                        display: flex;
                        page-break-after: always;
                        box-sizing: border-box;
                        margin: 0 auto 20px auto;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }

                    /* Panels */
                    .panel {
                        width: 50%;
                        height: 100%;
                        padding: 10mm;
                        box-sizing: border-box;
                        position: relative;
                    }
                    /* Add a light divider line between panels on screen only */
                    .landscape-page .panel:first-child {
                        border-right: 1px dashed #ddd; 
                    }

                    .panel-border {
                        border: 3px double ${themeColor}; 
                        height: 100%;
                        border-radius: 8px;
                        padding: 15px;
                        display: flex;
                        flex-direction: column;
                        background: #fff; 
                    }

                    /* Table Styles */
                    .mh-table { border-collapse: collapse; width: 100%; margin-bottom: 5px; }
                    .mh-table th, .mh-table td { 
                        border: 1px solid #bdc3c7; 
                        padding: 5px; 
                        text-align: center;
                        font-size: 0.85rem;
                    }
                    .mh-table th { 
                        background: ${accentColor}; 
                        color: ${themeColor};
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                    }
                    .grade-cell { font-weight: bold; color: ${themeColor}; }

                    /* Helper Functions CSS */
                    .sig-block { flex:1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; }
                    .sig-line { border-top: 1px solid ${themeColor}; width: 80%; height: 1px; margin-bottom: 5px; }
                    .sig-text { font-size: 0.8rem; font-weight: bold; color: ${themeColor}; }
                    
                    .remark-field { margin-bottom: 10px; }
                    .remark-label { font-size: 0.8rem; font-weight: bold; color: ${themeColor}; display: block; margin-bottom: 3px; }
                    .remark-line { border-bottom: 1px dotted #bdc3c7; height: 18px; width: 100%; }

                    @media print {
                        @page { size: A4 landscape; margin: 0 20mm; } /* 2cm left/right margin */
                        html, body { 
                            width: 100%; 
                            height: 100%; 
                            margin: 0 !important; 
                            padding: 0 !important; 
                            background: white;
                            -webkit-print-color-adjust: exact; 
                        }
                        
                        .no-print, .app-container > :not(.fade-in) { display: none !important; }
                        .app-container { margin: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; }
                        .fade-in { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                        
                        /* Maximize Space Usage - Fix Right Margin */
                        .landscape-page { 
                            margin: 0; 
                            box-shadow: none; 
                            width: 100vw; /* Force full viewport width */
                            max-width: 100%; 
                            height: 100vh; /* Force full viewport height */
                            display: flex;
                        }

                        .panel { 
                            flex: 1; /* Grow to fill space */
                            padding: 5mm; /* Balanced minimal padding */
                            max-width: 50%; /* Strictly half */
                        } 
                        
                        .panel-border { padding: 12px; } 

                        .landscape-page:last-child { page-break-after: auto; }
                        
                        /* Remove screen-only divider */
                        .landscape-page .panel:first-child { border-right: none; }
                        
                        /* Ensure colors print correctly */
                        .panel-border { border-color: ${themeColor} !important; }
                        .mh-table th { background-color: ${accentColor} !important; color: ${themeColor} !important; }
                    }
                </style>
            `;

        } catch (error) {
            console.error(error);
            alert("Error generating report: " + error.message);
        }
    }
};
