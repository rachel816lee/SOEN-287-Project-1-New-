// grades.js - Track Grades functionality
// Deliverable 1 - Frontend with hard-coded data
// RACHEL'S PART: Track Grades page with color-coded averages (Green/Orange/Red)

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
    { course: "COMP 352", courseName: "Data Structures", assessment: "Midterm", earned: 55, total: 100 },  // 55% - will be RED

    // Course: ENGR 213 (added to show orange range)
    { course: "ENGR 213", courseName: "Advanced Engineering Math", assessment: "Assignment 1", earned: 72, total: 100 },
    { course: "ENGR 213", courseName: "Advanced Engineering Math", assessment: "Midterm", earned: 68, total: 100 },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculatePercentage(earned, total) {
    return ((earned / total) * 100).toFixed(1);
}

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
// RACHEL'S PART: CALCULATE COURSE AVERAGES
// ============================================

function calculateCourseAverages() {
    const courseMap = new Map();

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

// ============================================
// RACHEL'S PART: DISPLAY COURSE AVERAGES WITH COLOR CODING
// ============================================

function displayCourseAverages() {
    const container = document.getElementById('courseAverages');
    const averages = calculateCourseAverages();

    if (averages.length === 0) {
        container.innerHTML = '<p>No courses found.</p>';
        return;
    }

    let html = '';
    averages.forEach(course => {
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

        html += `
            <div class="course-item">
                <div class="course-info">
                    <span class="course-code">${course.course}</span>
                    <span class="course-name">${course.courseName}</span>
                </div>
                <div class="course-grade">
                    <span class="course-average ${colorClass}">${course.average}%</span>
                    <span class="course-letter">${course.letterGrade}</span>
                    <span class="course-gpa">${course.gpa}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================
// RACHEL'S PART: CALCULATE GPA
// ============================================

function calculateOverallGPA() {
    const averages = calculateCourseAverages();

    if (averages.length === 0) return "0.00";

    const totalGPA = averages.reduce((sum, course) => {
        return sum + parseFloat(course.gpa);
    }, 0);

    return (totalGPA / averages.length).toFixed(2);
}

function displayGPA() {
    const gpaElement = document.getElementById('gpaDisplay');
    const overallGPA = calculateOverallGPA();

    gpaElement.innerHTML = `
        <span class="gpa-value">${overallGPA}</span>
        <span class="gpa-scale">out of 4.3</span>
    `;
}

// ============================================
// RACHEL'S PART: EXPORT FUNCTIONS
// ============================================

function exportToCSV() {
    let csvContent = "Course,Assessment,Earned Marks,Total Marks,Percentage\n";

    assessments.forEach(assessment => {
        const percentage = calculatePercentage(assessment.earned, assessment.total);
        csvContent += `${assessment.course},${assessment.assessment},${assessment.earned},${assessment.total},${percentage}%\n`;
    });

    csvContent += "\nCourse Averages\n";
    csvContent += "Course,Average %,Letter Grade,GPA\n";

    const averages = calculateCourseAverages();
    averages.forEach(course => {
        csvContent += `${course.course},${course.average}%,${course.letterGrade},${course.gpa}\n`;
    });

    const overallGPA = calculateOverallGPA();
    csvContent += `\nOverall GPA,${overallGPA}/4.3\n`;

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

    summary += "\n───────────────────────────────────────\n";
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
// INITIALIZATION
// ============================================

window.onload = function () {
    console.log('📊 Track Grades page loaded');
    displayCourseAverages();
    displayGPA();

    const dropdown = document.getElementById('exportFormat');
    if (dropdown) {
        dropdown.value = '';
    }
};