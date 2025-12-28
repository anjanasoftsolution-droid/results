/**
 * ResultBoom Exam Settings Module (Granular CCE Pattern)
 */

const Exams = {
    render() {
        const app = document.getElementById('app');
        const data = Storage.getExamSettings();
        const subjects = data.subjects || [];
        const lang = Storage.getLanguage();

        const T = {
            en: { title: "Detailed Exam Pattern", back: "Back", subjects: "Subjects", addSub: "Add Subject", subName: "Subject Name", subType: "Subject Type", scholastic: "Scholastic (FA + SA)", coSch: "Co-Scholastic (Art/PE)", config: "Max Marks Configuration", t1: "Term 1", t2: "Term 2", fa: "Formative Assessment (FA)", sa: "Summative Assessment (SA)", save: "Save All Patterns" },
            mr: { title: "परीक्षा पद्धती", back: "मागे", subjects: "विषय", addSub: "विषय जोडा", subName: "विषयाचे नाव", subType: "प्रकार", scholastic: "Scholastic (लेखी+तोंडी)", coSch: "Co-Scholastic (कला/कार्यानुभव)", config: "गुण पद्धती (Max Marks)", t1: "सत्र 1", t2: "सत्र 2", fa: "Formative (अंतर्गत)", sa: "Summative (लेखी/तोंडी)", save: "सेटिंग्ज जतन करा" }
        }[lang];

        // Default Max Marks Structure
        const defaultMM = {
            scholastic: {
                t1: { fa_oral: 5, fa_project: 10, fa_activity: 10, fa_practical: 0, fa_test: 10, fa_homework: 5, fa_other: 0, sa_oral: 5, sa_practical: 5, sa_written: 50 },
                t2: { fa_oral: 5, fa_project: 10, fa_activity: 10, fa_practical: 0, fa_test: 10, fa_homework: 5, fa_other: 0, sa_oral: 5, sa_practical: 5, sa_written: 50 }
            },
            co_scholastic: {
                t1: { fa_oral: 20, fa_project: 20, fa_activity: 20, fa_practical: 20, fa_test: 0, fa_homework: 0, fa_other: 20 },
                t2: { fa_oral: 20, fa_project: 20, fa_activity: 20, fa_practical: 20, fa_test: 0, fa_homework: 0, fa_other: 20 }
            }
        };

        const mm = data.granularMarks || defaultMM;

        const subjectList = subjects.map(sub => `
            <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px;">
                <div>
                    <span style="font-weight: 500;">${sub.name}</span>
                    <span style="display: block; font-size: 0.8rem; color: #888;">${sub.type === 'co-scholastic' ? T.coSch : T.scholastic}</span>
                </div>
                <button class="btn btn-danger" onclick="Exams.deleteSubject('${sub.id}')" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const emptySubjects = `
            <div class="text-center text-muted" style="padding: 20px;">
                No subjects added.
            </div>
        `;

        // Helper to generate inputs
        const generateInputs = (cat, term) => {
            const inputs = [
                { id: 'fa_oral', label: 'Daily Obs/Oral' },
                { id: 'fa_project', label: 'Project' },
                { id: 'fa_activity', label: 'Activity' },
                { id: 'fa_practical', label: 'Practicals' },
                { id: 'fa_test', label: 'Tests' },
                { id: 'fa_homework', label: 'Homework' },
                { id: 'fa_other', label: 'Other' },
                // SA is conditionally rendered
            ];

            // Render FA Inputs
            let html = `<div class="grid-container" style="grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px;">`;

            inputs.forEach(i => {
                html += `
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-size: 0.75rem;">${i.label}</label>
                        <input type="number" id="${cat}_${term}_${i.id}" class="glass-input" value="${mm[cat][term][i.id]}" style="padding: 5px;">
                    </div>
                `;
            });
            html += `</div>`;

            // Render SA Inputs (Only for scholastic)
            if (cat === 'scholastic') {
                html += `<h5 style="margin-bottom: 10px; font-size: 0.9rem; color: var(--accent);">${T.sa}</h5>`;
                html += `<div class="grid-container" style="grid-template-columns: repeat(3, 1fr); gap: 10px;">`;

                const saInputs = [
                    { id: 'sa_oral', label: 'Oral' },
                    { id: 'sa_practical', label: 'Practical' },
                    { id: 'sa_written', label: 'Written' }
                ];

                saInputs.forEach(i => {
                    html += `
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label" style="font-size: 0.75rem;">${i.label}</label>
                            <input type="number" id="${cat}_${term}_${i.id}" class="glass-input" value="${mm[cat][term][i.id]}" style="padding: 5px;">
                        </div>
                    `;
                });
                html += `</div>`;
            }

            return html;
        };

        app.innerHTML = `
            <div class="fade-in" style="max-width: 1000px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="App.router('dashboard')">
                        <i class="fas fa-arrow-left"></i> ${T.back}
                    </button>
                    <h1>${T.title}</h1>
                </div>

                <div class="grid-container" style="margin-top: 0; grid-template-columns: 350px 1fr;">
                    
                    <!-- Subject Management -->
                    <div>
                        <h3 class="mb-4">${T.subjects}</h3>
                        <div class="glass-card" style="margin-bottom: 20px;">
                            <form onsubmit="Exams.addSubject(event)">
                                <div class="form-group">
                                    <label class="form-label">${T.subName}</label>
                                    <input type="text" id="newSubject" class="glass-input" placeholder="e.g. Mathematics" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">${T.subType}</label>
                                    <select id="newSubjectType" class="glass-input">
                                        <option value="scholastic">${T.scholastic}</option>
                                        <option value="co-scholastic">${T.coSch}</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">${T.addSub}</button>
                            </form>
                        </div>
                        
                        <div style="max-height: 500px; overflow-y: auto;">
                            ${subjects.length > 0 ? subjectList : emptySubjects}
                        </div>
                    </div>

                    <!-- Criteria Settings -->
                    <div>
                        <h3 class="mb-4">${T.config}</h3>
                        <div class="glass-card">
                            <form onsubmit="Exams.saveSettings(event)">
                                
                                <!-- Scholastic Section -->
                                <div style="margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                                    <h4 style="margin-bottom: 15px; color: var(--primary);">${T.scholastic} (${T.t1})</h4>
                                    <p class="text-muted text-sm" style="margin-bottom: 10px;">${T.fa}</p>
                                    ${generateInputs('scholastic', 't1')}
                                    
                                    <h4 style="margin: 20px 0 15px 0; color: var(--primary);">${T.scholastic} (${T.t2})</h4>
                                    ${generateInputs('scholastic', 't2')}
                                </div>

                                <!-- Co-Scholastic Section -->
                                <div>
                                    <h4 style="margin-bottom: 15px; color: var(--secondary);">${T.coSch}</h4>
                                    <div class="alert" style="margin-bottom: 15px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.85rem;">
                                        <i class="fas fa-info-circle"></i> These subjects only have Formative Assessment.
                                    </div>

                                    <h5 style="margin-bottom: 10px;">${T.t1}</h5>
                                    ${generateInputs('co_scholastic', 't1')}
                                    
                                    <h5 style="margin: 20px 0 10px 0;">${T.t2}</h5>
                                    ${generateInputs('co_scholastic', 't2')}
                                </div>
                                
                                <div style="margin-top: 30px; text-align: right;">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> ${T.save}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    addSubject(e) {
        e.preventDefault();
        const input = document.getElementById('newSubject');
        const typeInput = document.getElementById('newSubjectType');
        const name = input.value.trim();
        if (!name) return;

        const data = Storage.getExamSettings();
        if (!data.subjects) data.subjects = [];

        data.subjects.push({
            id: Date.now().toString(),
            name: name,
            type: typeInput.value
        });

        Storage.saveExamSettings(data);
        this.render();
    },

    deleteSubject(id) {
        if (confirm('Delete this subject? Associated marks might be orphaned.')) {
            const data = Storage.getExamSettings();
            if (data.subjects) {
                data.subjects = data.subjects.filter(s => s.id !== id);
                Storage.saveExamSettings(data);
                this.render();
            }
        }
    },

    saveSettings(e) {
        e.preventDefault();
        const data = Storage.getExamSettings();

        const extract = (cat, term) => {
            const keys = ['fa_oral', 'fa_project', 'fa_activity', 'fa_practical', 'fa_test', 'fa_homework', 'fa_other'];
            if (cat === 'scholastic') keys.push('sa_oral', 'sa_practical', 'sa_written');

            const result = {};
            keys.forEach(k => {
                const el = document.getElementById(`${cat}_${term}_${k}`);
                if (el) result[k] = parseInt(el.value) || 0;
            });
            return result;
        };

        data.granularMarks = {
            scholastic: {
                t1: extract('scholastic', 't1'),
                t2: extract('scholastic', 't2')
            },
            co_scholastic: {
                t1: extract('co_scholastic', 't1'),
                t2: extract('co_scholastic', 't2')
            }
        };

        Storage.saveExamSettings(data);
        alert('Pattern settings saved successfully!');
    }
};
