// server.js - Smart Course Companion Backend
// Deliverable 2 - Full Stack Application

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
    secret: 'smart-course-companion-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// ============================================
// DATABASE SETUP
// ============================================
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        fullname TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Courses table
    db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        instructor TEXT NOT NULL,
        term TEXT NOT NULL,
        status TEXT DEFAULT 'enabled',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
    )`);

    // Student Courses (enrollment)
    db.run(`CREATE TABLE IF NOT EXISTS student_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        UNIQUE(student_id, course_id)
    )`);

    // Assessments table
    db.run(`CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'assignment',
        max_score REAL DEFAULT 100,
        due_date DATE,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    // Grades table
    db.run(`CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        assessment_id INTEGER NOT NULL,
        earned_score REAL NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (assessment_id) REFERENCES assessments(id),
        UNIQUE(student_id, assessment_id)
    )`);

    // Insert sample data if empty
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            insertSampleData();
        }
    });
}

// Insert sample data for testing
async function insertSampleData() {
    console.log('Inserting sample data...');
    
    // Hash passwords
    const studentPassword = await bcrypt.hash('student123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Insert users
    db.run(`INSERT INTO users (username, email, fullname, password, role) VALUES 
        ('student1', 'student1@example.com', 'John Student', ?, 'student'),
        ('admin1', 'admin@example.com', 'Admin User', ?, 'admin')`,
        [studentPassword, adminPassword]
    );
    
    // Insert courses
    db.run(`INSERT INTO courses (code, name, instructor, term, status, created_by) VALUES 
        ('SOEN 287', 'Web Programming', 'Dr. Benharref', 'Winter 2026', 'enabled', 2),
        ('SOEN 341', 'Software Process', 'Dr. Ormandjieva', 'Winter 2026', 'enabled', 2),
        ('COMP 352', 'Data Structures', 'Dr. Probst', 'Winter 2026', 'disabled', 2),
        ('ENGR 213', 'Advanced Engineering Math', 'Dr. Kokotov', 'Winter 2026', 'enabled', 2)`
    );
    
    // Enroll student in courses
    db.run(`INSERT INTO student_courses (student_id, course_id) VALUES 
        (1, 1), (1, 2), (1, 4)`);
    
    // Insert assessments
    db.run(`INSERT INTO assessments (course_id, name, type, max_score) VALUES 
        (1, 'Assignment 1', 'assignment', 100),
        (1, 'Assignment 2', 'assignment', 100),
        (1, 'Quiz 1', 'quiz', 100),
        (1, 'Midterm', 'exam', 100),
        (2, 'Assignment 1', 'assignment', 100),
        (2, 'Assignment 2', 'assignment', 100),
        (2, 'Quiz 1', 'quiz', 100),
        (4, 'Assignment 1', 'assignment', 100),
        (4, 'Midterm', 'exam', 100)`
    );
    
    // Insert grades
    db.run(`INSERT INTO grades (student_id, assessment_id, earned_score) VALUES 
        (1, 1, 85), (1, 2, 92), (1, 3, 78), (1, 4, 88),
        (1, 5, 95), (1, 6, 90), (1, 7, 82),
        (1, 8, 72), (1, 9, 68)`);
    
    console.log('Sample data inserted');
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login first' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login first' });
    }
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// ============================================
// API ROUTES - AUTHENTICATION
// ============================================

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', 
        [username, username], 
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            
            res.json({ 
                success: true, 
                user: { id: user.id, username: user.username, role: user.role }
            });
        });
});

// Signup
app.post('/api/signup', async (req, res) => {
    const { fullname, email, username, password, confirmPassword } = req.body;
    
    if (!fullname || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (fullname, email, username, password, role) 
                VALUES (?, ?, ?, ?, 'student')`,
            [fullname, email, username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                
                req.session.userId = this.lastID;
                req.session.username = username;
                req.session.role = 'student';
                
                res.json({ success: true, user: { id: this.lastID, username, role: 'student' } });
            });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Check session
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            loggedIn: true, 
            user: { id: req.session.userId, username: req.session.username, role: req.session.role }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// ============================================
// API ROUTES - COURSES
// ============================================

// Get all courses (admin sees all, student sees enrolled)
app.get('/api/courses', requireAuth, (req, res) => {
    if (req.session.role === 'admin') {
        db.all('SELECT * FROM courses ORDER BY code', (err, courses) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(courses);
        });
    } else {
        db.all(`SELECT c.* FROM courses c
                JOIN student_courses sc ON c.id = sc.course_id
                WHERE sc.student_id = ? AND c.status = 'enabled'`,
            [req.session.userId],
            (err, courses) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(courses);
            });
    }
});

// Create course (admin only)
app.post('/api/courses', requireAdmin, (req, res) => {
    const { code, name, instructor, term } = req.body;
    
    if (!code || !name || !instructor || !term) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    db.run(`INSERT INTO courses (code, name, instructor, term, created_by) 
            VALUES (?, ?, ?, ?, ?)`,
        [code, name, instructor, term, req.session.userId],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Course code already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, id: this.lastID, message: 'Course created successfully' });
        });
});

// Update course (admin only)
app.put('/api/courses/:id', requireAdmin, (req, res) => {
    const { name, instructor, term, status } = req.body;
    const courseId = req.params.id;
    
    let query = 'UPDATE courses SET ';
    const updates = [];
    const values = [];
    
    if (name) { updates.push('name = ?'); values.push(name); }
    if (instructor) { updates.push('instructor = ?'); values.push(instructor); }
    if (term) { updates.push('term = ?'); values.push(term); }
    if (status) { updates.push('status = ?'); values.push(status); }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    
    query += updates.join(', ') + ' WHERE id = ?';
    values.push(courseId);
    
    db.run(query, values, function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
        res.json({ success: true, message: 'Course updated successfully' });
    });
});

// Delete course (admin only)
app.delete('/api/courses/:id', requireAdmin, (req, res) => {
    const courseId = req.params.id;
    
    db.run('DELETE FROM courses WHERE id = ?', [courseId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
        res.json({ success: true, message: 'Course deleted successfully' });
    });
});

// Toggle course status (admin only)
app.patch('/api/courses/:id/toggle', requireAdmin, (req, res) => {
    const courseId = req.params.id;
    
    db.get('SELECT status FROM courses WHERE id = ?', [courseId], (err, course) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        const newStatus = course.status === 'enabled' ? 'disabled' : 'enabled';
        db.run('UPDATE courses SET status = ? WHERE id = ?', [newStatus, courseId], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, status: newStatus, message: `Course ${newStatus}` });
        });
    });
});

// Enroll student in course (student only)
app.post('/api/courses/:id/enroll', requireAuth, (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Only students can enroll' });
    }
    
    const courseId = req.params.id;
    
    db.run('INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)',
        [req.session.userId, courseId],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Already enrolled in this course' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Enrolled successfully' });
        });
});

// ============================================
// API ROUTES - GRADES
// ============================================

// Get grades for student
app.get('/api/grades', requireAuth, (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    
    db.all(`SELECT a.name as assessment_name, a.max_score, g.earned_score, c.code as course_code, c.name as course_name
            FROM grades g
            JOIN assessments a ON g.assessment_id = a.id
            JOIN courses c ON a.course_id = c.id
            WHERE g.student_id = ?`,
        [req.session.userId],
        (err, grades) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(grades);
        });
});

// Get course averages
app.get('/api/course-averages', requireAuth, (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    
    db.all(`SELECT 
                c.code as course_code,
                c.name as course_name,
                ROUND(AVG(g.earned_score), 1) as average,
                ROUND(AVG(g.earned_score) / 100 * 4.3, 2) as gpa
            FROM grades g
            JOIN assessments a ON g.assessment_id = a.id
            JOIN courses c ON a.course_id = c.id
            WHERE g.student_id = ?
            GROUP BY c.id`,
        [req.session.userId],
        (err, averages) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(averages);
        });
});

// Get overall GPA
app.get('/api/gpa', requireAuth, (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    
    db.get(`SELECT ROUND(AVG(avg.gpa), 2) as overall_gpa
            FROM (
                SELECT ROUND(AVG(g.earned_score) / 100 * 4.3, 2) as gpa
                FROM grades g
                JOIN assessments a ON g.assessment_id = a.id
                WHERE g.student_id = ?
                GROUP BY a.course_id
            ) as avg`,
        [req.session.userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ gpa: result.overall_gpa || 0 });
        });
});

// Submit or update grade
app.post('/api/grades', requireAuth, (req, res) => {
    if (req.session.role !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    
    const { assessment_id, earned_score } = req.body;
    
    if (!assessment_id || earned_score === undefined) {
        return res.status(400).json({ error: 'Assessment ID and score required' });
    }
    
    if (earned_score < 0 || earned_score > 100) {
        return res.status(400).json({ error: 'Score must be between 0 and 100' });
    }
    
    db.run(`INSERT INTO grades (student_id, assessment_id, earned_score)
            VALUES (?, ?, ?)
            ON CONFLICT(student_id, assessment_id) 
            DO UPDATE SET earned_score = ?, submitted_at = CURRENT_TIMESTAMP`,
        [req.session.userId, assessment_id, earned_score, earned_score],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, message: 'Grade saved successfully' });
        });
});

// ============================================
// SERVE FRONTEND FILES
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Smart Course Companion Server Running`);
    console.log(`========================================`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`----------------------------------------`);
    console.log(`Default Login Credentials:`);
    console.log(`  Student: student1 / student123`);
    console.log(`  Admin:   admin1 / admin123`);
    console.log(`========================================`);
});