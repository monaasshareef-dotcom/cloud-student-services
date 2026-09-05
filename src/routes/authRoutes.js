const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/db');

// POST /api/auth/login - Authenticate User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
        if (userRes.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        let studentInfo = null;
        if (user.role === 'STUDENT') {
            const studentRes = await db.query('SELECT * FROM students WHERE user_id = $1', [user.id]);
            if (studentRes.rows.length > 0) {
                studentInfo = studentRes.rows[0];
            }
        }

        // Establish Session & Token
        const sessionUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            studentId: studentInfo ? studentInfo.id : null,
            name: studentInfo ? studentInfo.full_name : (user.role === 'ADMIN' ? 'Administrator' : user.email),
            studentNumber: studentInfo ? studentInfo.student_number : null,
            department: studentInfo ? studentInfo.department : null,
            level: studentInfo ? studentInfo.level : null
        };

        req.session.user = sessionUser;
        const token = Buffer.from(JSON.stringify(sessionUser)).toString('base64');

        return res.json({
            success: true,
            message: 'Login successful',
            user: sessionUser,
            token: token
        });

    } catch (err) {
        console.error('[Auth Login Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
});

const { getUserFromReq } = require('../middleware/auth');

// GET /api/auth/me - Current Session Profile
router.get('/me', (req, res) => {
    const user = getUserFromReq(req);
    if (user) {
        return res.json({
            success: true,
            user: user
        });
    }
    return res.json({
        success: false,
        user: null
    });
});

// POST /api/auth/logout - Destroy Session
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not log out. Please try again.'
                });
            }
            res.clearCookie('sid');
            return res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    } else {
        return res.json({
            success: true,
            message: 'Already logged out'
        });
    }
});

module.exports = router;
