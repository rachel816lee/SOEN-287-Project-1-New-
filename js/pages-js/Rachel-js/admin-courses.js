// admin-courses.js - Admin Course Management
// Deliverable 1 - Frontend with hard-coded data
// Rachel's part: Delete and Enable/Disable functions only

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
        
        // RACHEL'S PART: Actions column only has Toggle and Delete buttons (NO EDIT)
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
                    <button class="action-btn btn-toggle" onclick="toggleCourseStatus(${course.id})">${toggleButtonText}</button>
                    <button class="action-btn btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// ============================================
// CREATE COURSE - This is for Hanan's part
// The form ID is provided by Rachel's hidden form
// ============================================

/**
 * Handle form submission to create a new course
 */
document.getElementById('createCourseForm').addEventListener('submit', function(event) {
    // Prevent the form from actually submitting (refreshing the page)
    event.preventDefault();
    
    // Get form values from Hanan's form
    // Note: Hanan's form doesn't have IDs, so we need to get elements by other means
    const forms = document.getElementsByTagName('form');
    let courseCode = '', courseName = '', instructor = '', term = '';
    
    // Find Hanan's Add Course form (the first form in the page)
    for (let i = 0; i < forms.length; i++) {
        const labels = forms[i].getElementsByTagName('label');
        if (labels.length > 0 && labels[0].textContent.includes('Course Code')) {
            // This is likely Hanan's Add Course form
            const inputs = forms[i].getElementsByTagName('input');
            if (inputs.length >= 4) {
                courseCode = inputs[0].value.trim();
                courseName = inputs[1].value.trim();
                instructor = inputs[2].value.trim();
                term = inputs[3].value.trim();
            }
            break;
        }
    }
    
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
    
    // Clear Hanan's form
    const inputs = document.querySelector('.create-course form').getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    
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
// RACHEL'S PART: DELETE COURSE
// ============================================

/**
 * Delete a course by ID (from table button)
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

/**
 * Handle Delete Course form submission
 */
document.getElementById('deleteCourseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const deleteCode = document.getElementById('deleteCourseCode').value.trim();
    
    if (!deleteCode) {
        showMessage('Please enter a course code.', 'error');
        return;
    }
    
    // Find the course with matching code
    const courseToDelete = courses.find(c => c.code === deleteCode);
    
    if (!courseToDelete) {
        showMessage(`Course code ${deleteCode} not found!`, 'error');
        return;
    }
    
    // Confirm deletion
    const confirmDelete = confirm(`Are you sure you want to delete course ${deleteCode}?`);
    
    if (confirmDelete) {
        // Filter out the course
        courses = courses.filter(course => course.code !== deleteCode);
        
        // Refresh the table
        displayCourses();
        
        // Clear the form
        document.getElementById('deleteCourseCode').value = '';
        
        // Show success message
        showMessage(`Course ${deleteCode} deleted successfully!`, 'success');
    }
});

// ============================================
// RACHEL'S PART: ENABLE/DISABLE COURSE
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
    
    // Make sure it's visible
    messageArea.style.display = 'block';
    
    // Hide the message after 3 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 3000);
}

// ============================================
// REMOVED: editCourse function (not Rachel's part)
// ============================================

// ============================================
// INITIALIZE THE PAGE
// ============================================

/**
 * This runs when the page loads
 */
window.onload = function() {
    displayCourses();
};