// admin-courses.js - Admin Course Management
// Deliverable 1 - Frontend with hard-coded data

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
        status: "disabled"  // This course is disabled
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

/**
 * Display all courses in the table
 * This function is called whenever courses are added, deleted, or toggled
 */
function displayCourses() {
    const tableBody = document.getElementById('coursesBody');
    
    if (courses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No courses found.</td></tr>';
        return;
    }
    
    let html = '';
    courses.forEach(course => {
        // Determine status badge class
        const statusClass = course.status === 'enabled' ? 'status-enabled' : 'status-disabled';
        const statusText = course.status === 'enabled' ? 'Enabled' : 'Disabled';
        
        // Add special class for disabled rows
        const rowClass = course.status === 'disabled' ? 'disabled-row' : '';
        
        // Toggle button text depends on current status
        const toggleButtonText = course.status === 'enabled' ? 'Disable' : 'Enable';
        
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
                    <button class="action-btn btn-edit" onclick="editCourse(${course.id})">Edit</button>
                    <button class="action-btn btn-toggle" onclick="toggleCourseStatus(${course.id})">${toggleButtonText}</button>
                    <button class="action-btn btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// ============================================
// CREATE COURSE
// ============================================

/**
 * Handle form submission to create a new course
 */
document.getElementById('createCourseForm').addEventListener('submit', function(event) {
    // Prevent the form from actually submitting (refreshing the page)
    event.preventDefault();
    
    // Get form values
    const courseCode = document.getElementById('courseCode').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const instructor = document.getElementById('instructor').value.trim();
    const term = document.getElementById('term').value.trim();
    
    // Validate form
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
    
    // Create new course object
    const newCourse = {
        id: generateNewId(),
        code: courseCode,
        name: courseName,
        instructor: instructor,
        term: term,
        status: 'enabled'  // New courses are enabled by default
    };
    
    // Add to courses array
    courses.push(newCourse);
    
    // Clear form
    document.getElementById('createCourseForm').reset();
    
    // Refresh the table
    displayCourses();
    
    // Show success message
    showMessage(`Course ${courseCode} created successfully!`, 'success');
});

/**
 * Generate a new unique ID for a course
 */
function generateNewId() {
    if (courses.length === 0) return 1;
    
    // Find the maximum ID and add 1
    const maxId = Math.max(...courses.map(c => c.id));
    return maxId + 1;
}

// ============================================
// DELETE COURSE - FEATURE 1 (for instructor)
// ============================================

/**
 * Delete a course by ID
 */
function deleteCourse(courseId) {
    // Find the course to delete
    const courseToDelete = courses.find(c => c.id === courseId);
    
    if (!courseToDelete) return;
    
    // Ask for confirmation (good practice for delete operations)
    const confirmDelete = confirm(`Are you sure you want to delete course ${courseToDelete.code}?`);
    
    if (confirmDelete) {
        // Filter out the course with the given ID
        courses = courses.filter(course => course.id !== courseId);
        
        // Refresh the table
        displayCourses();
        
        // Show success message
        showMessage(`Course ${courseToDelete.code} deleted successfully!`, 'success');
    }
}

// ============================================
// ENABLE/DISABLE COURSE - FEATURE 2 (for instructor)
// ============================================

/**
 * Toggle course status between enabled and disabled
 */
function toggleCourseStatus(courseId) {
    // Find the course
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    // Toggle the status
    const oldStatus = course.status;
    course.status = course.status === 'enabled' ? 'disabled' : 'enabled';
    
    // Refresh the table
    displayCourses();
    
    // Show success message
    const action = course.status === 'enabled' ? 'enabled' : 'disabled';
    showMessage(`Course ${course.code} has been ${action}.`, 'success');
}

// ============================================
// EDIT COURSE (for completeness)
// ============================================

/**
 * Edit a course (simplified for Deliverable 1)
 * In a real app, this would open a form to edit details
 */
function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    // For Deliverable 1, we'll just show an alert with the course info
    // In Deliverable 2, you would open an edit form
    alert(`
        Edit Course: ${course.code}
        
        To edit course details in a real application:
        1. Open a modal form
        2. Pre-fill with current values
        3. Save changes
        
        For now, you can:
        - Delete and recreate the course
        - Or wait for Deliverable 2 implementation
    `);
}

// ============================================
// MESSAGE DISPLAY FUNCTION
// ============================================

/**
 * Show a message to the user
 */
function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    
    // Set the message text
    messageArea.textContent = message;
    
    // Set the appropriate class for styling
    messageArea.className = 'message-area';
    messageArea.classList.add(`message-${type}`);
    
    /* Hide the message after 3 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 3000);
    */
    
    // Make sure it's visible
    messageArea.style.display = 'block';
}

// ============================================
// INITIALIZE THE PAGE
// ============================================

/**
 * This runs when the page loads
 */
window.onload = function() {
    displayCourses();
};