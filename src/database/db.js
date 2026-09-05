const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let pool = null;
let useMemoryStore = false;

// Memory Store initial state (for seamless local development if PostgreSQL is not connected)
const memoryStore = {
    users: [],
    students: [],
    courses: [],
    registration_requests: [],
    nextId: {
        users: 1,
        students: 1,
        courses: 1,
        registration_requests: 1
    }
};

// Seed Memory Store with required initial Demo Data
function seedMemoryStore() {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const studentPasswordHash = bcrypt.hashSync('student123', 10);
    const student2PasswordHash = bcrypt.hashSync('student123', 10);

    // Users
    memoryStore.users = [
        { id: 1, email: 'admin@example.com', password_hash: adminPasswordHash, role: 'ADMIN', created_at: new Date() },
        { id: 2, email: 'student@example.com', password_hash: studentPasswordHash, role: 'STUDENT', created_at: new Date() },
        { id: 3, email: 'sara@example.com', password_hash: student2PasswordHash, role: 'STUDENT', created_at: new Date() }
    ];

    // Students
    memoryStore.students = [
        { id: 1, user_id: 2, student_number: '2024001', full_name: 'Ahmed Ali', email: 'student@example.com', department: 'Computer Science', level: 'Level 3', created_at: new Date() },
        { id: 2, user_id: 3, student_number: '2024002', full_name: 'Sara Mohammed', email: 'sara@example.com', department: 'Information Systems', level: 'Level 4', created_at: new Date() }
    ];

    // Courses
    memoryStore.courses = [
        { id: 1, course_code: 'CS101', course_name: 'Introduction to Programming', credit_hours: 3, instructor: 'Dr. Sarah Connor', available_seats: 25, status: 'AVAILABLE', created_at: new Date() },
        { id: 2, course_code: 'DB201', course_name: 'Database Systems & Cloud SQL', credit_hours: 4, instructor: 'Prof. Robert Lang', available_seats: 18, status: 'AVAILABLE', created_at: new Date() },
        { id: 3, course_code: 'NET202', course_name: 'Computer Networks & Security', credit_hours: 3, instructor: 'Dr. Michael Chang', available_seats: 30, status: 'AVAILABLE', created_at: new Date() },
        { id: 4, course_code: 'WEB203', course_name: 'Web Development & Modern APIs', credit_hours: 3, instructor: 'Eng. Mona Ahmed', available_seats: 0, status: 'UNAVAILABLE', created_at: new Date() },
        { id: 5, course_code: 'CLOUD301', course_name: 'Cloud Computing & PaaS Architecture', credit_hours: 4, instructor: 'Dr. Alex Vance', available_seats: 15, status: 'AVAILABLE', created_at: new Date() }
    ];

    // Registration Requests
    memoryStore.registration_requests = [
        { id: 1, student_id: 1, course_id: 1, status: 'APPROVED', requested_at: new Date(Date.now() - 86400000 * 2), processed_at: new Date(Date.now() - 86400000) },
        { id: 2, student_id: 1, course_id: 2, status: 'PENDING', requested_at: new Date(Date.now() - 3600000 * 4), processed_at: null },
        { id: 3, student_id: 2, course_id: 3, status: 'PENDING', requested_at: new Date(Date.now() - 3600000 * 2), processed_at: null }
    ];

    memoryStore.nextId = { users: 4, students: 3, courses: 6, registration_requests: 4 };
}

// Initialize Memory Store synchronously by default
if (!process.env.DATABASE_URL) {
    useMemoryStore = true;
    seedMemoryStore();
}

// Initialize Database connection (PostgreSQL if DATABASE_URL is set)
async function initDb() {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl) {
        try {
            console.log('[Cloud Database] Connecting to PostgreSQL database...');
            pool = new Pool({
                connectionString: dbUrl,
                ssl: process.env.NODE_ENV === 'production' || dbUrl.includes('render.com') || dbUrl.includes('sslmode=require')
                    ? { rejectUnauthorized: false }
                    : false
            });

            // Test connection
            const client = await pool.connect();
            console.log('[Cloud Database] PostgreSQL connected successfully.');
            useMemoryStore = false;

            // Execute Schema SQL
            const schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                await client.query(schemaSql);
                console.log('[Cloud Database] Database schema created / updated successfully.');
            }

            // Check if users exist, seed demo users if empty
            const userCheck = await client.query('SELECT COUNT(*) FROM users');
            if (parseInt(userCheck.rows[0].count, 10) === 0) {
                console.log('[Cloud Database] Seeding initial Demo Users and Courses...');
                const adminHash = await bcrypt.hash('admin123', 10);
                const studentHash = await bcrypt.hash('student123', 10);

                const adminRes = await client.query(
                    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
                    ['admin@example.com', adminHash, 'ADMIN']
                );

                const studentUserRes = await client.query(
                    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
                    ['student@example.com', studentHash, 'STUDENT']
                );

                const studentIdRes = await client.query(
                    `INSERT INTO students (user_id, student_number, full_name, email, department, level)
                     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                    [studentUserRes.rows[0].id, '2024001', 'Ahmed Ali', 'student@example.com', 'Computer Science', 'Level 3']
                );

                // Seed Courses
                const seedPath = path.join(process.cwd(), 'src', 'database', 'seed.sql');
                if (fs.existsSync(seedPath)) {
                    const seedSql = fs.readFileSync(seedPath, 'utf8');
                    await client.query(seedSql);
                }

                // Initial Request
                const courseRes = await client.query(`SELECT id FROM courses WHERE course_code = 'CS101' LIMIT 1`);
                if (courseRes.rows.length > 0) {
                    await client.query(
                        `INSERT INTO registration_requests (student_id, course_id, status) VALUES ($1, $2, $3)`,
                        [studentIdRes.rows[0].id, courseRes.rows[0].id, 'PENDING']
                    );
                }
                console.log('[Cloud Database] Seeding complete.');
            }

            client.release();
            return;
        } catch (err) {
            console.error('[Cloud Database] PostgreSQL Connection Notice:', err.message);
            console.log('[Cloud Database] Switching to local dynamic memory database for testing session.');
            useMemoryStore = true;
            seedMemoryStore();
        }
    } else {
        console.log('[Cloud Database] No DATABASE_URL specified. Running with local dynamic memory database.');
        useMemoryStore = true;
        if (memoryStore.users.length === 0) {
            seedMemoryStore();
        }
    }
}

// Database Abstraction Helper Methods
async function query(text, params = []) {
    if (!useMemoryStore && pool) {
        return pool.query(text, params);
    }

    // Memory Store Query Emulation for seamless local testing
    return executeMemoryQuery(text, params);
}

function executeMemoryQuery(text, params) {
    const cleanText = text.trim().toLowerCase();

    // 1. Users Queries
    if (cleanText.includes('from users') && cleanText.includes('where email =')) {
        const email = params[0];
        const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return { rows: user ? [user] : [] };
    }

    if (cleanText.includes('insert into users')) {
        const [email, password_hash, role] = params;
        const newUser = {
            id: memoryStore.nextId.users++,
            email,
            password_hash,
            role,
            created_at: new Date()
        };
        memoryStore.users.push(newUser);
        return { rows: [newUser] };
    }

    // 2. Students Queries
    if (cleanText.includes('from students') && cleanText.includes('where user_id =')) {
        const userId = params[0];
        const student = memoryStore.students.find(s => s.user_id == userId);
        return { rows: student ? [student] : [] };
    }

    if (cleanText.includes('from students') && cleanText.includes('where id =')) {
        const studentId = params[0];
        const student = memoryStore.students.find(s => s.id == studentId);
        return { rows: student ? [student] : [] };
    }

    if (cleanText.includes('select * from students') || cleanText.includes('select s.*')) {
        return { rows: [...memoryStore.students] };
    }

    if (cleanText.includes('insert into students')) {
        const [user_id, student_number, full_name, email, department, level] = params;
        const newStudent = {
            id: memoryStore.nextId.students++,
            user_id,
            student_number,
            full_name,
            email,
            department,
            level,
            created_at: new Date()
        };
        memoryStore.students.push(newStudent);
        return { rows: [newStudent] };
    }

    if (cleanText.includes('update students')) {
        const [student_number, full_name, email, department, level, id] = params;
        const student = memoryStore.students.find(s => s.id == id);
        if (student) {
            student.student_number = student_number;
            student.full_name = full_name;
            student.email = email;
            student.department = department;
            student.level = level;
        }
        return { rows: student ? [student] : [] };
    }

    if (cleanText.includes('delete from students')) {
        const id = params[0];
        const studentIndex = memoryStore.students.findIndex(s => s.id == id);
        if (studentIndex !== -1) {
            const student = memoryStore.students[studentIndex];
            memoryStore.students.splice(studentIndex, 1);
            // Delete user as well
            const userIndex = memoryStore.users.findIndex(u => u.id == student.user_id);
            if (userIndex !== -1) memoryStore.users.splice(userIndex, 1);
        }
        return { rows: [] };
    }

    // 3. Courses Queries
    if (cleanText.includes('from courses') && cleanText.includes('where id =')) {
        const id = params[0];
        const course = memoryStore.courses.find(c => c.id == id);
        return { rows: course ? [course] : [] };
    }

    if (cleanText.includes('select * from courses') || cleanText.includes('from courses')) {
        return { rows: [...memoryStore.courses] };
    }

    if (cleanText.includes('insert into courses')) {
        const [course_code, course_name, credit_hours, instructor, available_seats, status] = params;
        const newCourse = {
            id: memoryStore.nextId.courses++,
            course_code,
            course_name,
            credit_hours: parseInt(credit_hours, 10),
            instructor,
            available_seats: parseInt(available_seats, 10),
            status: status || 'AVAILABLE',
            created_at: new Date()
        };
        memoryStore.courses.push(newCourse);
        return { rows: [newCourse] };
    }

    if (cleanText.includes('update courses')) {
        const [course_code, course_name, credit_hours, instructor, available_seats, status, id] = params;
        const course = memoryStore.courses.find(c => c.id == id);
        if (course) {
            course.course_code = course_code;
            course.course_name = course_name;
            course.credit_hours = parseInt(credit_hours, 10);
            course.instructor = instructor;
            course.available_seats = parseInt(available_seats, 10);
            course.status = status;
        }
        return { rows: course ? [course] : [] };
    }

    if (cleanText.includes('delete from courses')) {
        const id = params[0];
        const idx = memoryStore.courses.findIndex(c => c.id == id);
        if (idx !== -1) memoryStore.courses.splice(idx, 1);
        return { rows: [] };
    }

    // 4. Registration Requests Queries
    if (cleanText.includes('select * from registration_requests where student_id =')) {
        const [student_id, course_id] = params;
        const req = memoryStore.registration_requests.find(r => r.student_id == student_id && r.course_id == course_id);
        return { rows: req ? [req] : [] };
    }

    if (cleanText.includes('insert into registration_requests')) {
        const [student_id, course_id] = params;
        const newReq = {
            id: memoryStore.nextId.registration_requests++,
            student_id: parseInt(student_id, 10),
            course_id: parseInt(course_id, 10),
            status: 'PENDING',
            requested_at: new Date(),
            processed_at: null
        };
        memoryStore.registration_requests.push(newReq);
        return { rows: [newReq] };
    }

    if (cleanText.includes('update registration_requests set status =')) {
        const [status, id] = params;
        const req = memoryStore.registration_requests.find(r => r.id == id);
        if (req) {
            req.status = status;
            req.processed_at = new Date();
        }
        return { rows: req ? [req] : [] };
    }

    // Custom Join Queries Emulation for Student & Admin Requests
    if (cleanText.includes('from registration_requests') || cleanText.includes('registration_requests r')) {
        let list = memoryStore.registration_requests.map(r => {
            const student = memoryStore.students.find(s => s.id == r.student_id) || {};
            const course = memoryStore.courses.find(c => c.id == r.course_id) || {};
            return {
                id: r.id,
                student_id: r.student_id,
                course_id: r.course_id,
                status: r.status,
                requested_at: r.requested_at,
                processed_at: r.processed_at,
                student_name: student.full_name || 'Unknown Student',
                student_number: student.student_number || '',
                department: student.department || '',
                course_code: course.course_code || '',
                course_name: course.course_name || '',
                credit_hours: course.credit_hours || 0,
                instructor: course.instructor || ''
            };
        });

        if (cleanText.includes('where r.student_id =') || cleanText.includes('where student_id =')) {
            const student_id = params[0];
            list = list.filter(item => item.student_id == student_id);
        }

        return { rows: list };
    }

    // Default counts & fallbacks
    if (cleanText.includes('count(*)')) {
        let count = 0;
        if (cleanText.includes('from users')) count = memoryStore.users.length;
        else if (cleanText.includes('from students')) count = memoryStore.students.length;
        else if (cleanText.includes('from courses')) count = memoryStore.courses.length;
        else if (cleanText.includes('from registration_requests')) {
            if (cleanText.includes("status = 'pending'")) {
                count = memoryStore.registration_requests.filter(r => r.status === 'PENDING').length;
            } else if (cleanText.includes("status = 'approved'")) {
                count = memoryStore.registration_requests.filter(r => r.status === 'APPROVED').length;
            } else {
                count = memoryStore.registration_requests.length;
            }
        }
        return { rows: [{ count: count.toString() }] };
    }

    return { rows: [] };
}

module.exports = {
    initDb,
    query,
    get isMemory() { return useMemoryStore; }
};
