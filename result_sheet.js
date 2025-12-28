/**
 * ResultBoom Master Result Sheet (Gazette) - Localized & Enhanced
 */

const ResultSheet = {
    render() {
        // Setup State
        this.term = 't1';
        this.renderView();
    },

    renderView() {
        const app = document.getElementById('app');
        const students = Storage.getStudents();
        const settings = Storage.getExamSettings();
        const allMarks = Storage.getMarks();
        const subjects = settings.subjects || [];
        const profile = Storage.getProfile();
        const lang = Storage.getLanguage();

        const T = {
            en: {
                back: "Back",
                print: "Print Sheet",
                title: "Master Result Sheet",
                schoolName: "School Name",
                roll: "Roll No.",
                studentName: "Student Name",
                total: "Total",
                grade: "Grade",
                overall: "Overall",
                t1: "First Semester",
                t2: "Second Semester",
                std: "Standard",
                teacher: "Class Teacher",
                year: "Academic Year",
                enrollment: "Enrollment Details",
                boys: "Boys",
                girls: "Girls",
                totalStud: "Total",
                noSub: "No subjects found."
            },
            mr: {
                back: "मागे",
                print: "प्रिंट करा",
                title: "निकाल पत्रक (Master Result Sheet)",
                schoolName: "शाळेचे नाव",
                roll: "हजेरी क्र.",
                studentName: "विद्यार्थ्याचे नाव",
                total: "एकूण",
                grade: "श्रेणी",
                overall: "एकूण निकाल",
                t1: "प्रथम सत्र परीक्षा",
                t2: "द्वितीय सत्र परीक्षा",
                std: "इयत्ता",
                teacher: "वर्ग शिक्षक",
                year: "शैक्षणिक वर्ष",
                enrollment: "पटसंख्या",
                boys: "मुले",
                girls: "मुली",
                totalStud: "एकूण",
                noSub: "विषय आढळले नाहीत."
            }
        }[lang];

        // Ensure Profile defaults
        const schoolName = profile.schoolName || T.schoolName;
        const teacherName = profile.name || '-';
        const std = profile.std || '-';
        const academicYear = "2024-25";

        // Calculate Stats
        const totalStudents = students.length;
        const boysCount = students.filter(s => s.gender === 'Male').length;
        const girlsCount = students.filter(s => s.gender === 'Female').length;

        // Controls
        const controls = `
            <div class="no-print" style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                <button class="btn btn-secondary" onclick="Reports.render()">
                    <i class="fas fa-arrow-left"></i> ${T.back}
                </button>
                <select id="rsTerm" class="glass-input" style="width: auto;" onchange="ResultSheet.updateTerm(this.value)">
                    <option value="t1" ${this.term === 't1' ? 'selected' : ''}>${T.t1}</option>
                    <option value="t2" ${this.term === 't2' ? 'selected' : ''}>${T.t2}</option>
                </select>
                <div style="flex-grow: 1; text-align: right;">
                    <button class="btn btn-primary" onclick="window.print()">
                        <i class="fas fa-print"></i> ${T.print}
                    </button>
                </div>
            </div>
        `;

        if (subjects.length === 0) {
            app.innerHTML = `<div class="fade-in">${controls}<div class="p-5 text-center">${T.noSub}</div></div>`;
            return;
        }

        // --- HEADER GENERATION ---
        let headerRow1 = `<th rowspan="2" style="width: 40px;">${T.roll}</th><th rowspan="2" style="width: 150px; text-align: left;">${T.studentName}</th>`;
        let headerRow2 = ``;

        subjects.forEach(sub => {
            const type = sub.type || 'scholastic';
            const isScholastic = type === 'scholastic';
            const colSpan = isScholastic ? 4 : 2;

            headerRow1 += `<th colspan="${colSpan}" style="text-align: center; border-left: 2px solid #333;">${sub.name}</th>`;

            if (isScholastic) {
                headerRow2 += `
                    <th style="font-size: 0.75rem; border-left: 2px solid #333; text-align: center;">FA</th>
                    <th style="font-size: 0.75rem; text-align: center;">SA</th>
                    <th style="font-size: 0.75rem; text-align: center; font-weight: bold;">${T.total}</th>
                    <th style="font-size: 0.75rem; text-align: center;">${T.grade}</th>
                `;
            } else {
                headerRow2 += `
                    <th style="font-size: 0.75rem; border-left: 2px solid #333; text-align: center;">FA</th>
                    <th style="font-size: 0.75rem; text-align: center;">${T.grade}</th>
                `;
            }
        });

        // Grand Total Headers
        headerRow1 += `<th colspan="3" style="border-left: 2px solid #333;">${T.overall}</th>`;
        headerRow2 += `<th style="border-left: 2px solid #333;">${T.total}</th><th>%</th><th>${T.grade}</th>`;


        // --- ROW GENERATION ---
        const rows = students.map((std, idx) => {
            let cells = `
                <td style="text-align: center;">${idx + 1}</td>
                <td style="font-weight: 500;">${std.name}</td>
            `;

            let studentGrandTotal = 0;
            let studentGrandMax = 0;

            subjects.forEach(sub => {
                const type = sub.type || 'scholastic';
                const configKey = type.replace('-', '_');
                const config = (settings.granularMarks && settings.granularMarks[configKey] && settings.granularMarks[configKey][this.term]) || {};
                const marks = (allMarks[std.id] && allMarks[std.id][this.term] && allMarks[std.id][this.term][sub.id]) || {};

                // Calculate FA
                let faTotal = 0;
                let faMax = 0;
                ['fa_oral', 'fa_project', 'fa_activity', 'fa_practical', 'fa_test', 'fa_homework', 'fa_other'].forEach(k => {
                    if (config[k]) {
                        faTotal += parseFloat(marks[k] || 0);
                        faMax += config[k];
                    }
                });

                // Calculate SA
                let saTotal = 0;
                let saMax = 0;
                if (type === 'scholastic') {
                    ['sa_oral', 'sa_practical', 'sa_written'].forEach(k => {
                        if (config[k]) {
                            saTotal += parseFloat(marks[k] || 0);
                            saMax += config[k];
                        }
                    });
                }

                // Sub Calculations
                const total = faTotal + saTotal;
                const max = faMax + saMax;
                const percentage = max > 0 ? (total / max) * 100 : 0;
                const grade = max > 0 ? Grading.calculateGrade(percentage).grade : '-';

                // Append Cells
                cells += `<td style="border-left: 2px solid #ddd; text-align: center;">${faTotal}</td>`;
                if (type === 'scholastic') {
                    cells += `<td style="text-align: center;">${saTotal}</td>`;
                    cells += `<td style="text-align: center; font-weight: bold; background: #f8fafc;">${total}</td>`;
                    cells += `<td style="text-align: center; font-size: 0.85rem;">${grade}</td>`;
                } else {
                    cells += `<td style="text-align: center; font-size: 0.85rem;">${grade}</td>`;
                }

                // Add to Grand Total
                studentGrandTotal += total;
                studentGrandMax += max;
            });

            // Overall Columns
            const finalPercentage = studentGrandMax > 0 ? ((studentGrandTotal / studentGrandMax) * 100) : 0;
            const finalGrade = studentGrandMax > 0 ? Grading.calculateGrade(finalPercentage).grade : '-';

            cells += `
                <td style="border-left: 2px solid #333; text-align: center; font-weight: bold;">${studentGrandTotal}</td>
                <td style="text-align: center;">${finalPercentage.toFixed(1)}%</td>
                <td style="text-align: center; font-weight: bold; color: var(--primary);">${finalGrade}</td>
            `;

            return `<tr>${cells}</tr>`;
        }).join('');


        // --- RENDER ---
        const currentTermName = this.term === 't1' ? T.t1 : T.t2;

        app.innerHTML = `
            <div class="fade-in">
                ${controls}
                
                <div class="sheet-container" style="background: white; color: black; padding: 20px; overflow-x: auto;">
                    <!-- Report Header with Details -->
                    <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
                        <h2 style="margin: 0; text-transform: uppercase;">${schoolName}</h2>
                        <h3 style="margin: 5px 0; font-weight: normal; font-size: 1.2rem;">${T.title} - ${currentTermName}</h3>
                        
                        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-weight: bold; font-size: 0.9rem;">
                            <span>${T.std}: ${std}</span>
                            <span>${T.teacher}: ${teacherName}</span>
                            <span>${T.year}: ${academicYear}</span>
                        </div>
                        
                        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 10px; font-size: 0.9rem; background: #f1f5f9; padding: 5px; border-radius: 4px;">
                            <span>${T.enrollment}:</span>
                            <span>${T.boys}: ${boysCount}</span>
                            <span>${T.girls}: ${girlsCount}</span>
                            <span>${T.totalStud}: ${totalStudents}</span>
                        </div>
                    </div>

                    <table class="result-sheet-table">
                        <thead>
                            <tr>${headerRow1}</tr>
                            <tr>${headerRow2}</tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>

                <style>
                    /* Custom Table Styles for Result Sheet */
                    .result-sheet-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-family: 'Arial', sans-serif; 
                        font-size: 11px; 
                    }
                    .result-sheet-table th, .result-sheet-table td {
                        border: 1px solid #ccc;
                        padding: 5px 3px;
                        white-space: nowrap;
                    }
                    .result-sheet-table th {
                        background: #f1f5f9;
                    }

                    @media print {
                        @page { size: A3 landscape; margin: 10mm; }
                        body { background: white; visibility: hidden; }
                        .sheet-container { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; padding: 0; margin: 0; }
                        .no-print { display: none !important; }
                        .app-container > :not(.fade-in) { display: none; }
                        .result-sheet-table th { background: #eee !important; -webkit-print-color-adjust: exact; }
                    }
                </style>
            </div>
        `;
    },

    updateTerm(t) {
        this.term = t;
        this.renderView();
    }
};
