// admin-courses.js - Admin Course Management
// Deliverable 1 - Frontend with hard-coded data
// RACHEL'S PART: Delete, Enable/Disable, Edit, and Create functions

// ============================================
// HARD-CODED COURSES DATA (for Deliverable 1)
// ============================================
let courses = [
    {
        id: 1,
        code: "SOEN 287",
        name: "Web Programming",
        instructor: "Dr. Benharref",
        term: "Winter 2026",
        status: "enabled"  // enabled or disabled
    },
    {
        id: 2,
        code: "SOEN 341",
        name: "Software Process",
        instructor: "Dr. Ormandjieva",
        term: "Winter 2026",
        status: "enabled"
    },
    {
        id: 3,
        code: "COMP 352",
        name: "Data Structures",
        instructor: "Dr. Probst",
        term: "Winter 2026",
        status: "disabled"
    },
    {
        id: 4,
        code: "ENGR 213",
        name: "Advanced Engineering Mathematics",
        instructor: "Dr. Kokotov",
        term: "Winter 2026",
        status: "enabled"
    },
    {
        id: 5,
        code: "SOEN 228",
        name: "Computer Hardware",
        instructor: "Dr. Talhi",
        term: "Winter 2026",
        status: "enabled"
    }
];

// ============================================
// DISPLAY COURSES IN TABLE
// ============================================

function displayCourses() {
    const tableBody = document.getElementById('coursesBody');
    
    if (courses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No courses found.</td></tr>';
        return;
    }
    
    let html = '';
    courses.forEach(course => {
        const statusClass = course.status === 'enabled' ? 'status-enabled' : 'status-disabled';
        const statusText = course.status === 'enabled' ? 'Enabled' : 'Disabled';
        const rowClass = course.status === 'disabled' ? 'disabled-row' : '';
        const toggleButtonText = course.status === 'enabled' ? 'Disable' : 'Enable';
        
        // RACHEL'S PART: Actions column now has Edit, Toggle, and Delete buttons
        html += `
            <tr class="${rowClass}" data-course-id="${course.id}">
                <td><strong>${course.code}</strong></td>
                <td>${course.name}</td>
                <td>${course.instructor}</td>
                <td>${course.term}</td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="action-btn btn-edit" onclick="editCourse('${course.code}')">Edit</button>
                    <button class="action-btn btn-toggle" onclick="toggleCourseStatus(${course.id})">${toggleButtonText}</button>
                    <button class="action-btn btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// ============================================
// RACHEL'S PART: EDIT COURSE FUNCTION
// ============================================

/**
 * Edit a course - fills the edit form with current course data
 */
function editCourse(courseCode) {
    const course = courses.find(c => c.code === courseCode);
    
    if (!course) {
        showMessage(`Course ${courseCode} not found!`, 'error');
        return;
    }
    
    // Fill the edit form with current course data
    document.getElementById('editCourseCode').value = course.code;
    document.getElementById('editCourseName').value = course.name;
    document.getElementById('editInstructor').value = course.instructor;
    document.getElementById('editTerm').value = course.term;
    
    // Scroll to edit form
    document.getElementById('edit').scrollIntoView({ behavior: 'smooth' });
    
    showMessage(`Editing course: ${course.code}. Make changes and click Save Changes.`, 'success');
}

/**
 * Handle Edit Course form submission
 */
function handleEditCourse(event) {
    event.preventDefault();
    
    const courseCode = document.getElementById('editCourseCode').value.trim();
    const newName = document.getElementById('editCourseName').value.trim();
    const newInstructor = document.getElementById('editInstructor').value.trim();
    const newTerm = document.getElementById('editTerm').value.trim();
    
    if (!courseCode) {
        showMessage('Please enter a course code to edit.', 'error');
        return;
    }
    
    // Find the course
    const courseIndex = courses.findIndex(c => c.code === courseCode);
    
    if (courseIndex === -1) {
        showMessage(`Course ${courseCode} not found!`, 'error');
        return;
    }
    
    // Update fields (only if new values are provided)
    if (newName) courses[courseIndex].name = newName;
    if (newInstructor) courses[courseIndex].instructor = newInstructor;
    if (newTerm) courses[courseIndex].term = newTerm;
    
    // Clear the edit form
    document.getElementById('editCourseName').value = '';
    document.getElementById('editInstructor').value = '';
    document.getElementById('editTerm').value = '';
    
    // Refresh the table
    displayCourses();
    
    showMessage(`Course ${courseCode} updated successfully!`, 'success');
}

// ============================================
// RACHEL'S PART: CREATE COURSE
// ============================================

function handleCreateCourse(event) {
    event.preventDefault();
    
    const courseCode = document.getElementById('createCourseCode').value.trim();
    const courseName = document.getElementById('createCourseName').value.trim();
    const instructor = document.getElementById('createInstructor').value.trim();
    const term = document.getElementById('createTerm').value.trim();
    
    if (!courseCode || !courseName || !instructor || !term) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Check if course code already exists
    const existingCourse = courses.find(c => c.code === courseCode);
    if (existingCourse) {
        showMessage(`Course ${courseCode} already exists!`, 'error');
        return;
    }
    
    const newCourse = {
        id: generateNewId(),
        code: courseCode,
        name: courseName,
        instructor: instructor,
        term: term,
        status: 'enabled'
    };
    
    courses.push(newCourse);
    
    // Clear the create form
    document.getElementById('createCourseCode').value = '';
    document.getElementById('createCourseName').value = '';
    document.getElementById('createInstructor').value = '';
    document.getElementById('createTerm').value = '';
    
    // Clear checkboxes (HANAN'S PART - assessment categories)
    document.getElementById('catAssignments').checked = false;
    document.getElementById('catLabs').checked = false;
    document.getElementById('catQuizzes').checked = false;
    document.getElementById('catExams').checked = false;
    
    displayCourses();
    showMessage(`Course ${courseCode} created successfully!`, 'success');
}

function generateNewId() {
    if (courses.length === 0) return 1;
    const maxId = Math.max(...courses.map(c => c.id));
    return maxId + 1;
}

// ============================================
// RACHEL'S PART: DELETE COURSE
// ============================================

function deleteCourse(courseId) {
    const courseToDelete = courses.find(c => c.id === courseId);
    if (!courseToDelete) return;
    
    if (confirm(`Are you sure you want to delete course ${courseToDelete.code}?`)) {
        courses = courses.filter(course => course.id !== courseId);
        displayCourses();
        showMessage(`Course ${courseToDelete.code} deleted successfully!`, 'success');
    }
}

function handleDeleteCourse(event) {
    event.preventDefault();
    
    const deleteCode = document.getElementById('deleteCourseCode').value.trim();
    
    if (!deleteCode) {
        showMessage('Please enter a course code.', 'error');
        return;
    }
    
    const courseToDelete = courses.find(c => c.code === deleteCode);
    
    if (!courseToDelete) {
        showMessage(`Course code ${deleteCode} not found!`, 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete course ${deleteCode}?`)) {
        courses = courses.filter(course => course.code !== deleteCode);
        document.getElementById('deleteCourseCode').value = '';
        displayCourses();
        showMessage(`Course ${deleteCode} deleted successfully!`, 'success');
    }
}

// ============================================
// RACHEL'S PART: ENABLE/DISABLE COURSE
// ============================================

function toggleCourseStatus(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    course.status = course.status === 'enabled' ? 'disabled' : 'enabled';
    displayCourses();
    
    const action = course.status === 'enabled' ? 'enabled' : 'disabled';
    showMessage(`Course ${course.code} has been ${action}.`, 'success');
}

// ============================================
// MESSAGE DISPLAY FUNCTION
// ============================================

function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    messageArea.textContent = message;
    messageArea.className = 'message-area';
    messageArea.classList.add(`message-${type}`);
    messageArea.style.display = 'block';
    
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 3000);
}

// ============================================
// INITIALIZE THE PAGE
// ============================================

window.onload = function() {
    displayCourses();
    
    // RACHEL'S PART: Attach event handlers
    document.getElementById('createCourseForm').addEventListener('submit', handleCreateCourse);
    document.getElementById('editCourseForm').addEventListener('submit', handleEditCourse);
    document.getElementById('deleteCourseForm').addEventListener('submit', handleDeleteCourse);
};