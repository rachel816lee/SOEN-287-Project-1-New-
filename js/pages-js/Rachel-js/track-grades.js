// track-grades.js - Track Grades functionality
// Deliverable 2 - Full Stack with Backend API
// RACHEL'S PART: Track Grades page with color-coded averages (Green/Orange/Red)

// ============================================
// GLOBAL VARIABLES
// ============================================
let courseAverages = [];
let allGrades = [];

// ============================================
// HELPER FUNCTIONS
// ============================================

function percentageToLetterGrade(percentage) {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 77) return "B+";
    if (percentage >= 73) return "B";
    if (percentage >= 70) return "B-";
    if (percentage >= 67) return "C+";
    if (percentage >= 63) return "C";
    if (percentage >= 60) return "C-";
    if (percentage >= 57) return "D+";
    if (percentage >= 53) return "D";
    if (percentage >= 50) return "D-";
    return "F";
}

// ============================================
// RACHEL'S PART: LOAD DATA FROM API
// ============================================

async function loadCourseAverages() {
    try {
        const response = await fetch('/api/course-averages');
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '../Hanan-html/loginPage.html';
                return;
            }
            throw new Error('Failed to load course averages');
        }
        
        courseAverages = await response.json();
        displayCourseAverages();
    } catch (error) {
        console.error('Error loading course averages:', error);
        const container = document.getElementById('courseAverages');
        if (container) {
            container.innerHTML = '<p>Error loading grades. Please make sure you are logged in.</p>';
        }
    }
}

async function loadGPA() {
    try {
        const response = await fetch('/api/gpa');
        if (!response.ok) throw new Error('Failed to load GPA');
        
        const data = await response.json();
        displayGPA(data.gpa);
    } catch (error) {
        console.error('Error loading GPA:', error);
        const gpaElement = document.getElementById('gpaDisplay');
        if (gpaElement) {
            gpaElement.innerHTML = '<span class="gpa-value">0.00</span><span class="gpa-scale">out of 4.3</span>';
        }
    }
}

async function loadGrades() {
    try {
        const response = await fetch('/api/grades');
        if (!response.ok) throw new Error('Failed to load grades');
        
        allGrades = await response.json();
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

// ============================================
// RACHEL'S PART: DISPLAY COURSE AVERAGES WITH COLOR CODING
// ============================================

function displayCourseAverages() {
    const container = document.getElementById('courseAverages');
    
    if (!courseAverages || courseAverages.length === 0) {
        container.innerHTML = '<p>No courses found. Please enroll in courses first.</p>';
        return;
    }

    let html = '';
    courseAverages.forEach(course => {
        const percentage = parseFloat(course.average);
        
        // RACHEL'S PART: Grade color based on percentage
        // Green: >= 80%, Orange: 60-79%, Red: < 60%
        let colorClass = '';
        if (percentage >= 80) {
            colorClass = 'grade-green';
        } else if (percentage >= 60) {
            colorClass = 'grade-orange';
        } else {
            colorClass = 'grade-red';
        }
        
        const letterGrade = percentageToLetterGrade(percentage);
        const gpaValue = course.gpa || (percentage / 100 * 4.3).toFixed(2);

        html += `
            <div class="course-item">
                <div class="course-info">
                    <span class="course-code">${escapeHtml(course.course_code)}</span>
                    <span class="course-name">${escapeHtml(course.course_name)}</span>
                </div>
                <div class="course-grade">
                    <span class="course-average ${colorClass}">${course.average}%</span>
                    <span class="course-letter">${letterGrade}</span>
                    <span class="course-gpa">${gpaValue}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function displayGPA(gpa) {
    const gpaElement = document.getElementById('gpaDisplay');
    const gpaValue = gpa || 0;
    
    gpaElement.innerHTML = `
        <span class="gpa-value">${gpaValue}</span>
        <span class="gpa-scale">out of 4.3</span>
    `;
}

// ============================================
// RACHEL'S PART: EXPORT FUNCTIONS
// ============================================

function exportToCSV() {
    let csvContent = "Course,Assessment,Earned Marks,Total Marks,Percentage\n";
    
    allGrades.forEach(grade => {
        const percentage = ((grade.earned_score / grade.max_score) * 100).toFixed(1);
        csvContent += `${grade.course_code},${grade.assessment_name},${grade.earned_score},${grade.max_score},${percentage}%\n`;
    });
    
    csvContent += "\nCourse Averages\n";
    csvContent += "Course,Average %,Letter Grade\n";
    
    courseAverages.forEach(course => {
        const letterGrade = percentageToLetterGrade(parseFloat(course.average));
        csvContent += `${course.course_code},${course.average}%,${letterGrade}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_grades.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function exportToPDF() {
    let summary = "═══════════════════════════════════════\n";
    summary += "         GRADES SUMMARY REPORT          \n";
    summary += "═══════════════════════════════════════\n\n";
    
    summary += "COURSE AVERAGES:\n";
    summary += "───────────────────────────────────────\n";
    
    courseAverages.forEach(course => {
        const letterGrade = percentageToLetterGrade(parseFloat(course.average));
        summary += `${course.course_code.padEnd(10)} ${course.course_name.padEnd(20)} ${course.average.padStart(5)}%  ${letterGrade}\n`;
    });
    
    summary += "\n───────────────────────────────────────\n\n";
    summary += "DETAILED ASSESSMENTS:\n";
    summary += "───────────────────────────────────────\n";
    
    allGrades.forEach(grade => {
        const percentage = ((grade.earned_score / grade.max_score) * 100).toFixed(1);
        summary += `${grade.course_code.padEnd(10)} ${grade.assessment_name.padEnd(15)} ${grade.earned_score}/${grade.max_score} (${percentage}%)\n`;
    });
    
    summary += "\n═══════════════════════════════════════\n";
    summary += "     END OF REPORT - Deliverable 2     \n";
    summary += "═══════════════════════════════════════\n";
    
    alert("📄 PDF Export Simulation:\n\n" + summary);
}

function handleExport() {
    const format = document.getElementById('exportFormat').value;
    const exportButton = document.querySelector('.export-section button');
    
    if (format === 'pdf') {
        exportButton.style.backgroundColor = '#e74c3c';
        exportButton.textContent = 'Export as PDF';
    } else if (format === 'csv') {
        exportButton.style.backgroundColor = '#27ae60';
        exportButton.textContent = 'Export as CSV';
    } else {
        exportButton.style.backgroundColor = '#3498db';
        exportButton.textContent = 'Export';
    }
}

function exportSelected() {
    const format = document.getElementById('exportFormat').value;
    
    if (!format) {
        alert('⚠️ Please select an export format first!');
        return;
    }
    
    if (format === 'pdf') {
        exportToPDF();
    } else if (format === 'csv') {
        exportToCSV();
    }
}

// ============================================
// CHECK AUTHENTICATION
// ============================================

async function checkAuth() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        if (!data.loggedIn) {
            window.location.href = '../Hanan-html/loginPage.html';
        }
        if (data.user.role !== 'student') {
            // Students only
            if (data.user.role === 'admin') {
                // Admin can also view grades? Redirect to admin page
                // window.location.href = '../main page-html/admin side.html';
            }
        }
    } catch (error) {
        window.location.href = '../Hanan-html/loginPage.html';
    }
}

// ============================================
// INITIALIZATION
// ============================================

window.onload = async function () {
    console.log('📊 Track Grades page loaded');
    await checkAuth();
    await loadCourseAverages();
    await loadGPA();
    await loadGrades();
    
    const dropdown = document.getElementById('exportFormat');
    if (dropdown) {
        dropdown.value = '';
    }
};