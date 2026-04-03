// admin-courses.js - Admin Course Management
// Deliverable 2 - Full Stack with Backend API
// RACHEL'S PART: Delete, Enable/Disable, Edit, and Create functions

// ============================================
// API BASE URL
// ============================================
const API_BASE = '';

// ============================================
// DISPLAY COURSES IN TABLE (Load from API)
// ============================================

async function displayCourses() {
    const tableBody = document.getElementById('coursesBody');
    
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '../Hanan-html/loginPage.html';
                return;
            }
            throw new Error('Failed to load courses');
        }
        
        const courses = await response.json();
        
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
            
            html += `
                <tr class="${rowClass}" data-course-id="${course.id}">
                    <td><strong>${escapeHtml(course.code)}</strong></td>
                    <td>${escapeHtml(course.name)}</td>
                    <td>${escapeHtml(course.instructor)}</td>
                    <td>${escapeHtml(course.term)}</td>
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
    } catch (error) {
        console.error('Error loading courses:', error);
        showMessage('Failed to load courses', 'error');
    }
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================
// RACHEL'S PART: EDIT COURSE FUNCTION
// ============================================

async function editCourse(courseId) {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        const course = courses.find(c => c.id === courseId);
        
        if (!course) {
            showMessage(`Course not found!`, 'error');
            return;
        }
        
        // Fill the edit form with current course data
        document.getElementById('editCourseId').value = course.id;
        document.getElementById('editCourseCode').value = course.code;
        document.getElementById('editCourseName').value = course.name;
        document.getElementById('editInstructor').value = course.instructor;
        document.getElementById('editTerm').value = course.term;
        
        // Scroll to edit form
        document.getElementById('edit').scrollIntoView({ behavior: 'smooth' });
        
        showMessage(`Editing course: ${course.code}. Make changes and click Save Changes.`, 'success');
    } catch (error) {
        showMessage('Error loading course data', 'error');
    }
}

async function handleEditCourse(event) {
    event.preventDefault();
    
    const courseId = document.getElementById('editCourseId').value;
    const newName = document.getElementById('editCourseName').value.trim();
    const newInstructor = document.getElementById('editInstructor').value.trim();
    const newTerm = document.getElementById('editTerm').value.trim();
    
    if (!courseId) {
        showMessage('Please select a course to edit (click Edit button first).', 'error');
        return;
    }
    
    const updateData = {};
    if (newName) updateData.name = newName;
    if (newInstructor) updateData.instructor = newInstructor;
    if (newTerm) updateData.term = newTerm;
    
    if (Object.keys(updateData).length === 0) {
        showMessage('Please enter at least one field to update.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Clear the edit form
            document.getElementById('editCourseId').value = '';
            document.getElementById('editCourseCode').value = '';
            document.getElementById('editCourseName').value = '';
            document.getElementById('editInstructor').value = '';
            document.getElementById('editTerm').value = '';
            
            // Refresh the table
            await displayCourses();
            showMessage(`Course updated successfully!`, 'success');
        } else {
            showMessage(data.error || 'Update failed', 'error');
        }
    } catch (error) {
        showMessage('Error updating course', 'error');
    }
}

// ============================================
// RACHEL'S PART: CREATE COURSE
// ============================================

async function handleCreateCourse(event) {
    event.preventDefault();
    
    const courseCode = document.getElementById('createCourseCode').value.trim();
    const courseName = document.getElementById('createCourseName').value.trim();
    const instructor = document.getElementById('createInstructor').value.trim();
    const term = document.getElementById('createTerm').value.trim();
    
    if (!courseCode || !courseName || !instructor || !term) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: courseCode, name: courseName, instructor, term })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Clear the create form
            document.getElementById('createCourseCode').value = '';
            document.getElementById('createCourseName').value = '';
            document.getElementById('createInstructor').value = '';
            document.getElementById('createTerm').value = '';
            
            // Clear checkboxes
            document.getElementById('catAssignments').checked = false;
            document.getElementById('catLabs').checked = false;
            document.getElementById('catQuizzes').checked = false;
            document.getElementById('catExams').checked = false;
            
            await displayCourses();
            showMessage(`Course ${courseCode} created successfully!`, 'success');
        } else {
            showMessage(data.error || 'Create failed', 'error');
        }
    } catch (error) {
        showMessage('Error creating course', 'error');
    }
}

// ============================================
// RACHEL'S PART: DELETE COURSE
// ============================================

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        const response = await fetch(`/api/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            await displayCourses();
            showMessage(`Course deleted successfully!`, 'success');
        } else {
            showMessage(data.error || 'Delete failed', 'error');
        }
    } catch (error) {
        showMessage('Error deleting course', 'error');
    }
}

async function handleDeleteCourse(event) {
    event.preventDefault();
    
    const deleteCode = document.getElementById('deleteCourseCode').value.trim();
    
    if (!deleteCode) {
        showMessage('Please enter a course code.', 'error');
        return;
    }
    
    // First find the course by code
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        const course = courses.find(c => c.code === deleteCode);
        
        if (!course) {
            showMessage(`Course code ${deleteCode} not found!`, 'error');
            return;
        }
        
        if (confirm(`Are you sure you want to delete course ${deleteCode}?`)) {
            const deleteResponse = await fetch(`/api/courses/${course.id}`, {
                method: 'DELETE'
            });
            
            if (deleteResponse.ok) {
                document.getElementById('deleteCourseCode').value = '';
                await displayCourses();
                showMessage(`Course ${deleteCode} deleted successfully!`, 'success');
            } else {
                const data = await deleteResponse.json();
                showMessage(data.error || 'Delete failed', 'error');
            }
        }
    } catch (error) {
        showMessage('Error finding course', 'error');
    }
}

// ============================================
// RACHEL'S PART: ENABLE/DISABLE COURSE
// ============================================

async function toggleCourseStatus(courseId) {
    try {
        const response = await fetch(`/api/courses/${courseId}/toggle`, {
            method: 'PATCH'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            await displayCourses();
            showMessage(`Course ${data.status}`, 'success');
        } else {
            showMessage(data.error || 'Toggle failed', 'error');
        }
    } catch (error) {
        showMessage('Error toggling course status', 'error');
    }
}

// ============================================
// MESSAGE DISPLAY FUNCTION
// ============================================

function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    if (!messageArea) return;
    
    messageArea.textContent = message;
    messageArea.className = 'message-area';
    messageArea.classList.add(`message-${type}`);
    messageArea.style.display = 'block';
    
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 3000);
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
        if (data.user.role !== 'admin') {
            alert('Admin access required');
            window.location.href = '../../index.html';
        }
    } catch (error) {
        window.location.href = '../Hanan-html/loginPage.html';
    }
}

// ============================================
// INITIALIZE THE PAGE
// ============================================

window.onload = async function() {
    await checkAuth();
    await displayCourses();
    
    // Add hidden field for course ID in edit form
    const editForm = document.getElementById('editCourseForm');
    if (editForm && !document.getElementById('editCourseId')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'editCourseId';
        editForm.insertBefore(hiddenInput, editForm.firstChild);
    }
    
    // RACHEL'S PART: Attach event handlers
    document.getElementById('createCourseForm').addEventListener('submit', handleCreateCourse);
    document.getElementById('editCourseForm').addEventListener('submit', handleEditCourse);
    document.getElementById('deleteCourseForm').addEventListener('submit', handleDeleteCourse);
};