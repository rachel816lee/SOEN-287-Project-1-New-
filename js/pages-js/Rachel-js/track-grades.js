// grades.js - Track Grades functionality
// Deliverable 1 - Frontend with hard-coded data

// ============================================
// HARD-CODED ASSESSMENT DATA (for Deliverable 1)
// ============================================
const assessments = [
    // Course: SOEN 287
    { course: "SOEN 287", courseName: "Web Programming", assessment: "Assignment 1", earned: 85, total: 100 },
    { course: "SOEN 287", courseName: "Web Programming", assessment: "Assignment 2", earned: 92, total: 100 },
    { course: "SOEN 287", courseName: "Web Programming", assessment: "Quiz 1", earned: 78, total: 100 },
    { course: "SOEN 287", courseName: "Web Programming", assessment: "Midterm", earned: 88, total: 100 },
    
    // Course: SOEN 341
    { course: "SOEN 341", courseName: "Software Process", assessment: "Assignment 1", earned: 95, total: 100 },
    { course: "SOEN 341", courseName: "Software Process", assessment: "Assignment 2", earned: 90, total: 100 },
    { course: "SOEN 341", courseName: "Software Process", assessment: "Quiz 1", earned: 82, total: 100 },
    
    // Course: COMP 352
    { course: "COMP 352", courseName: "Data Structures", assessment: "Assignment 1", earned: 88, total: 100 },
    { course: "COMP 352", courseName: "Data Structures", assessment: "Assignment 2", earned: 76, total: 100 },
    { course: "COMP 352", courseName: "Data Structures", assessment: "Midterm", earned: 92, total: 100 }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate percentage from earned and total marks
 * @param {number} earned - Marks earned
 * @param {number} total - Total possible marks
 * @returns {string} Percentage with 1 decimal place
 */
function calculatePercentage(earned, total) {
    return ((earned / total) * 100).toFixed(1);
}

/**
 * Convert percentage to letter grade (Concordia 4.3 scale)
 * @param {number} percentage - Course percentage
 * @returns {string} Letter grade (A+, A, A-, etc.)
 */
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

/**
 * Convert percentage to GPA points (4.3 scale)
 * @param {number} percentage - Course percentage
 * @returns {number} GPA value
 */
function percentageToGPA(percentage) {
    if (percentage >= 90) return 4.3;
    if (percentage >= 85) return 4.0;
    if (percentage >= 80) return 3.7;
    if (percentage >= 77) return 3.3;
    if (percentage >= 73) return 3.0;
    if (percentage >= 70) return 2.7;
    if (percentage >= 67) return 2.3;
    if (percentage >= 63) return 2.0;
    if (percentage >= 60) return 1.7;
    if (percentage >= 57) return 1.3;
    if (percentage >= 53) return 1.0;
    if (percentage >= 50) return 0.7;
    return 0.0;
}

// ============================================
// FEATURE 1 & 2: CALCULATE AND DISPLAY COURSE AVERAGES
// ============================================

/**
 * Calculate average for each course
 * @returns {Array} Array of course objects with averages
 */
function calculateCourseAverages() {
    const courseMap = new Map();
    
    // Group assessments by course
    assessments.forEach(assessment => {
        if (!courseMap.has(assessment.course)) {
            courseMap.set(assessment.course, {
                course: assessment.course,
                courseName: assessment.courseName,
                totalEarned: 0,
                totalPossible: 0
            });
        }
        
        const courseData = courseMap.get(assessment.course);
        courseData.totalEarned += assessment.earned;
        courseData.totalPossible += assessment.total;
    });
    
    // Calculate averages for each course
    const averages = [];
    courseMap.forEach((data, courseCode) => {
        const percentage = (data.totalEarned / data.totalPossible) * 100;
        averages.push({
            course: courseCode,
            courseName: data.courseName,
            average: percentage.toFixed(1),
            letterGrade: percentageToLetterGrade(percentage),
            gpa: percentageToGPA(percentage).toFixed(2)
        });
    });
    
    return averages;
}

/**
 * Display course averages in the UI as a vertical list
 */
function displayCourseAverages() {
    const container = document.getElementById('courseAverages');
    const averages = calculateCourseAverages();
    
    if (averages.length === 0) {
        container.innerHTML = '<p>No courses found.</p>';
        return;
    }
    
    let html = '';
    averages.forEach(course => {
        const averageClass = parseFloat(course.average) >= 60 ? 'course-average' : 'course-average failing';
        
        html += `
            <div class="course-item">
                <div class="course-info">
                    <span class="course-code">${course.course}</span>
                    <span class="course-name">${course.courseName}</span>
                </div>
                <div class="course-grade">
                    <span class="${averageClass}">${course.average}%</span>
                    <span class="course-letter">${course.letterGrade}</span>
                    <span class="course-gpa">${course.gpa}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// FEATURE 3: CALCULATE AND DISPLAY GPA
// ============================================

/**
 * Calculate overall GPA across all courses
 * @returns {string} Overall GPA with 2 decimal places
 */
function calculateOverallGPA() {
    const averages = calculateCourseAverages();
    
    if (averages.length === 0) return "0.00";
    
    // Sum all GPA points and divide by number of courses
    const totalGPA = averages.reduce((sum, course) => {
        return sum + parseFloat(course.gpa);
    }, 0);
    
    return (totalGPA / averages.length).toFixed(2);
}

/**
 * Display overall GPA in the UI
 */
function displayGPA() {
    const gpaElement = document.getElementById('gpaDisplay');
    const overallGPA = calculateOverallGPA();
    
    gpaElement.innerHTML = `
        <span class="gpa-value">${overallGPA}</span>
        <span class="gpa-scale">out of 4.3</span>
    `;
}

// ============================================
// FEATURE 4: EXPORT FUNCTIONS
// ============================================

/**
 * Export grades to CSV file
 */
function exportToCSV() {
    // Create CSV header
    let csvContent = "Course,Assessment,Earned Marks,Total Marks,Percentage\n";
    
    // Add each assessment as a row
    assessments.forEach(assessment => {
        const percentage = calculatePercentage(assessment.earned, assessment.total);
        csvContent += `${assessment.course},${assessment.assessment},${assessment.earned},${assessment.total},${percentage}%\n`;
    });
    
    // Add empty line
    csvContent += "\n";
    
    // Add course averages section
    csvContent += "Course Averages\n";
    csvContent += "Course,Average %,Letter Grade,GPA\n";
    
    const averages = calculateCourseAverages();
    averages.forEach(course => {
        csvContent += `${course.course},${course.average}%,${course.letterGrade},${course.gpa}\n`;
    });
    
    // Add overall GPA
    const overallGPA = calculateOverallGPA();
    csvContent += `\nOverall GPA,${overallGPA}/4.3\n`;
    
    // Create download link
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

/**
 * Export grades to PDF (simulated for Deliverable 1)
 */
function exportToPDF() {
    const averages = calculateCourseAverages();
    const overallGPA = calculateOverallGPA();
    
    let summary = "═══════════════════════════════════════\n";
    summary += "         GRADES SUMMARY REPORT          \n";
    summary += "═══════════════════════════════════════\n\n";
    
    summary += "COURSE AVERAGES:\n";
    summary += "───────────────────────────────────────\n";
    
    averages.forEach(course => {
        summary += `${course.course.padEnd(10)} ${course.courseName.padEnd(20)} ${course.average.padStart(5)}%  ${course.letterGrade}  GPA: ${course.gpa}\n`;
    });
    
    summary += "\n";
    summary += "───────────────────────────────────────\n";
    summary += `OVERALL GPA: ${overallGPA}/4.3\n`;
    summary += "───────────────────────────────────────\n\n";
    
    summary += "DETAILED ASSESSMENTS:\n";
    summary += "───────────────────────────────────────\n";
    
    assessments.forEach(assessment => {
        const percentage = calculatePercentage(assessment.earned, assessment.total);
        summary += `${assessment.course.padEnd(10)} ${assessment.assessment.padEnd(15)} ${assessment.earned}/${assessment.total} (${percentage}%)\n`;
    });
    
    summary += "\n═══════════════════════════════════════\n";
    summary += "     END OF REPORT - Deliverable 1     \n";
    summary += "═══════════════════════════════════════\n";
    
    alert("📄 PDF Export Simulation:\n\n" + summary);
}

// ============================================
// EXPORT HANDLER FUNCTIONS
// ============================================

/**
 * Handle dropdown selection change
 */
function handleExport() {
    const format = document.getElementById('exportFormat').value;
    const exportButton = document.querySelector('.export-section button');
    
    // Change button color based on selection
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

/**
 * Handle export button click
 */
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
// INITIALIZATION
// ============================================

/**
 * Run when the page loads
 */
window.onload = function() {
    console.log('📊 Track Grades page loaded');
    displayCourseAverages();
    displayGPA();
    
    // Set default dropdown value
    const dropdown = document.getElementById('exportFormat');
    if (dropdown) {
        dropdown.value = '';
    }
};