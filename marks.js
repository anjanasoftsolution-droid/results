/**
 * ResultBoom Marks Entry Module (Subject-wise View)
 */

const Marks = {
    render() {
        this.state = {
            term: 't1', // 't1' or 't2'
            subjectId: '' // Selected subject
        };

        // Auto-select first subject if available
        const settings = Storage.getExamSettings();
        if (settings.subjects && settings.subjects.length > 0) {
            this.state.subjectId = settings.subjects[0].id;
        }

        this.renderView();
    },

    renderView() {
        const app = document.getElementById('app');
        const students = Storage.getStudents();
        const examSettings = Storage.getExamSettings();
        const allMarks = Storage.getMarks();
        const subjects = examSettings.subjects || [];
        const lang = Storage.getLanguage();

        const T = {
            en: {
                title: "Marks Entry",
                back: "Back",
                term: "Term",
                subject: "Subject",
                noSub: "No subjects added",
                addFirst: "Please add subjects in Exam Settings first.",
                template: "Template",
                import: "Import",
                studentName: "Student Name",
                total: "Total",
                scholastic: "Scholastic",
                coScholastic: "Co-Scholastic"
            },
            mr: {
                title: "गुण भरा",
                back: "मागे",
                term: "सत्र",
                subject: "विषय",
                noSub: "विषय नाहीत",
                addFirst: "कृपया आधी परीक्षा सेटिंग्जमध्ये विषय जोडा.",
                template: "टेंप्लेट (Excel)",
                import: "इम्पोर्ट",
                studentName: "विद्यार्थी नाव",
                total: "एकूण",
                scholastic: "Scholastic",
                coScholastic: "Co-Scholastic"
            }
        }[lang];

        // Controls
        const subjectOptions = subjects.map(s =>
            `<option value="${s.id}" ${this.state.subjectId === s.id ? 'selected' : ''}>${s.name} (${s.type === 'co-scholastic' ? 'Co-Sch.' : 'Scholastic'})</option>`
        ).join('');

        const controls = `
            <div class="glass-card" style="margin-bottom: 20px; display: flex; gap: 20px; flex-wrap: wrap; align-items: center;">
                <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                    <label class="form-label">${T.term}</label>
                    <select id="termSelect" class="glass-input" onchange="Marks.updateState('term', this.value)">
                        <option value="t1" ${this.state.term === 't1' ? 'selected' : ''}>Term 1</option>
                        <option value="t2" ${this.state.term === 't2' ? 'selected' : ''}>Term 2</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0; min-width: 250px;">
                    <label class="form-label">${T.subject}</label>
                    <select id="subjectSelect" class="glass-input" onchange="Marks.updateState('subjectId', this.value)">
                        ${subjects.length > 0 ? subjectOptions : `<option>${T.noSub}</option>`}
                    </select>
                </div>
                
                <div style="flex-grow: 1; text-align: right;">
                    <input type="file" id="marksImportFile" accept=".xlsx, .xls" style="display: none;" onchange="Marks.handleImport(this)">
                    <button class="btn btn-secondary" onclick="Marks.downloadTemplate()" title="Download Excel Template for this Subject">
                        <i class="fas fa-file-excel"></i> ${T.template}
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('marksImportFile').click()" title="Import Marks">
                        <i class="fas fa-file-upload"></i> ${T.import}
                    </button>
                </div>
            </div>
        `;

        // If no subject, show empty state
        if (!this.state.subjectId || subjects.length === 0) {
            app.innerHTML = `
                <div class="fade-in">
                    ${controls}
                    <div class="text-center text-muted p-5">${T.addFirst}</div>
                </div>`;
            return;
        }

        // Determine Columns
        const subject = subjects.find(s => s.id === this.state.subjectId);
        const subType = subject.type || 'scholastic';
        // Fix: Map 'co-scholastic' to 'co_scholastic' for config lookup
        const configKey = subType.replace('-', '_');
        const config = (examSettings.granularMarks && examSettings.granularMarks[configKey] && examSettings.granularMarks[configKey][this.state.term]) || {};

        // Build columns based on non-zero max marks
        const columns = [];

        // FA Columns
        const faKeys = {
            'fa_oral': 'Oral/Obs',
            'fa_project': 'Project',
            'fa_activity': 'Activity',
            'fa_practical': 'Pract.',
            'fa_test': 'Test',
            'fa_homework': 'HW',
            'fa_other': 'Other'
        };

        Object.keys(faKeys).forEach(k => {
            if (config[k] > 0) columns.push({ key: k, label: faKeys[k], max: config[k] });
        });

        // SA Columns (only if scholastic)
        if (subType === 'scholastic') {
            const saKeys = {
                'sa_oral': 'SA Oral',
                'sa_practical': 'SA Pract.',
                'sa_written': 'SA Writ.'
            };
            Object.keys(saKeys).forEach(k => {
                if (config[k] > 0) columns.push({ key: k, label: saKeys[k], max: config[k] });
            });
        }

        // Table Header
        let th = `<th style="padding: 15px; text-align: left; position: sticky; left: 0; background: var(--bg-dark); z-index: 10;">${T.studentName}</th>`;
        columns.forEach(c => {
            th += `<th style="padding: 10px; text-align: center; font-size: 0.9rem;">
                ${c.label}
                <div style="font-size: 0.7rem; opacity: 0.7;">(Max ${c.max})</div>
            </th>`;
        });
        th += `<th style="padding: 10px; text-align: center;">${T.total}</th>`;

        // Rows
        const rows = students.map(s => {
            const marksData = (allMarks[s.id] && allMarks[s.id][this.state.term] && allMarks[s.id][this.state.term][this.state.subjectId]) || {};

            let tds = `<td style="padding: 15px; font-weight: 500; position: sticky; left: 0; background: var(--bg-dark); z-index: 10;">${s.name}</td>`;
            let rowTotal = 0;

            columns.forEach(c => {
                const val = marksData[c.key] || '';
                if (val) rowTotal += parseFloat(val);

                tds += `
                    <td style="padding: 5px; text-align: center;">
                        <input type="number" 
                            class="glass-input student-mark-${s.id}" 
                            data-student="${s.id}"
                            style="width: 60px; text-align: center; padding: 5px;" 
                            placeholder="-"
                            min="0"
                            max="${c.max}"
                            value="${val}"
                            oninput="Marks.updateRowTotal('${s.id}')"
                            onchange="Marks.saveMark('${s.id}', '${c.key}', this.value)"
                        >
                    </td>
                `;
            });

            tds += `<td id="total-${s.id}" style="text-align: center; font-weight: bold; color: var(--primary);">${rowTotal || 0}</td>`;
            return `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">${tds}</tr>`;
        }).join('');

        app.innerHTML = `
            <div class="fade-in">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="App.router('dashboard')">
                        <i class="fas fa-arrow-left"></i> ${T.back}
                    </button>
                    <h1>${T.title}</h1>
                </div>

                ${controls}

                <div class="glass-card" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                ${th}
                            </tr>
                        </thead>
                        <tbody>
                            ${students.length > 0 ? rows : `<tr><td colspan="${columns.length + 2}" class="text-center p-5">No students found.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    updateState(key, val) {
        this.state[key] = val;
        this.renderView();
    },

    saveMark(studentId, key, value) {
        // Validation (Max marks check could go here)

        Storage.saveComponentMark(studentId, this.state.term, this.state.subjectId, key, value);

        // Re-calculate local total for immediate feedback (lazy way: rerender row or just calculate)
        // For now, let's just save. The total updates on re-render.
    },

    downloadTemplate() {
        if (!this.state.subjectId) { alert("Please select a subject first."); return; }

        const students = Storage.getStudents();
        const settings = Storage.getExamSettings();
        const subject = settings.subjects.find(s => s.id === this.state.subjectId);
        const subType = subject.type || 'scholastic';
        const config = (settings.granularMarks && settings.granularMarks[subType] && settings.granularMarks[subType][this.state.term]) || {};

        // Prepare Headers based on config
        const headers = ['Student ID', 'Student Name'];
        const keys = []; // to map back later

        // FA Keys
        const faMap = { 'fa_oral': 'FA Oral', 'fa_project': 'FA Project', 'fa_activity': 'FA Activity', 'fa_practical': 'FA Practical', 'fa_test': 'FA Test', 'fa_homework': 'FA Homework', 'fa_other': 'FA Other' };
        Object.keys(faMap).forEach(k => { if (config[k] > 0) { headers.push(faMap[k]); keys.push(k); } });

        // SA Keys
        if (subType === 'scholastic') {
            const saMap = { 'sa_oral': 'SA Oral', 'sa_practical': 'SA Practical', 'sa_written': 'SA Written' };
            Object.keys(saMap).forEach(k => { if (config[k] > 0) { headers.push(saMap[k]); keys.push(k); } });
        }

        // Create Data Rows
        const data = students.map(s => {
            const row = { 'Student ID': s.id, 'Student Name': s.name };
            headers.slice(2).forEach(h => row[h] = ''); // Empty cells for marks
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Marks");
        XLSX.writeFile(wb, `${subject.name}_Marks_Template.xlsx`);
    },

    handleImport(input) {
        const file = input.files[0];
        if (!file || !this.state.subjectId) return;

        // Logic check: need to know which column maps to which key
        // We will reconstruct the map based on the current subject config, similar to download
        const settings = Storage.getExamSettings();
        const subject = settings.subjects.find(s => s.id === this.state.subjectId);
        const subType = subject.type || 'scholastic';
        const config = (settings.granularMarks && settings.granularMarks[subType] && settings.granularMarks[subType][this.state.term]) || {};

        const keyMap = {}; // "FA Oral" -> "fa_oral"
        const faMap = { 'fa_oral': 'FA Oral', 'fa_project': 'FA Project', 'fa_activity': 'FA Activity', 'fa_practical': 'FA Practical', 'fa_test': 'FA Test', 'fa_homework': 'FA Homework', 'fa_other': 'FA Other' };
        Object.keys(faMap).forEach(k => { if (config[k] > 0) keyMap[faMap[k]] = k; });
        if (subType === 'scholastic') {
            const saMap = { 'sa_oral': 'SA Oral', 'sa_practical': 'SA Practical', 'sa_written': 'SA Written' };
            Object.keys(saMap).forEach(k => { if (config[k] > 0) keyMap[saMap[k]] = k; });
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                let updatedCount = 0;
                jsonData.forEach(row => {
                    const studentId = row['Student ID']; // Must match exactly
                    if (studentId) {
                        // Iterate over marks columns
                        Object.keys(keyMap).forEach(header => {
                            if (row[header] !== undefined) {
                                Storage.saveComponentMark(studentId.toString(), this.state.term, this.state.subjectId, keyMap[header], row[header]);
                            }
                        });
                        updatedCount++;
                    }
                });

                alert(`Successfully imported marks for ${updatedCount} students!`);
                this.renderView(); // Refresh to show new marks and totals
            } catch (err) {
                console.error(err);
                alert('Error processing file. Please ensure columns match the template.');
            }
        };
        reader.readAsArrayBuffer(file);
        input.value = '';
    },

    updateRowTotal(studentId) {
        const inputs = document.querySelectorAll(`.student-mark-${studentId}`);
        let total = 0;
        inputs.forEach(input => {
            const val = parseFloat(input.value);
            if (!isNaN(val)) total += val;
        });

        const totalEl = document.getElementById(`total-${studentId}`);
        if (totalEl) totalEl.innerText = total;
    }
};
