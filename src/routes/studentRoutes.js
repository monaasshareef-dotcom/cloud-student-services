const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Apply Student Authorization
router.use(requireAuth);
router.use(requireRole('STUDENT'));

// GET /api/student/dashboard - Student Summary Cards & Recent Requests
router.get('/dashboard', async (req, res) => {
    try {
        const studentId = req.session.user.studentId;

        // Get total requests count
        const requestsRes = await db.query(
            'SELECT r.*, c.course_name, c.course_code FROM registration_requests r JOIN courses c ON r.course_id = c.id WHERE r.student_id = $1 ORDER BY r.requested_at DESC',
            [studentId]
        );

        const requests = requestsRes.rows;
        const totalRequests = requests.length;
        const approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
        const pendingRequests = requests.filter(r => r.status === 'PENDING').length;

        // Active courses count (approved requests)
        const myCoursesCount = approvedRequests;

        return res.json({
            success: true,
            summary: {
                myCourses: myCoursesCount,
                requests: totalRequests,
                approved: approvedRequests,
                pending: pendingRequests
            },
            recentRequests: requests.slice(0, 5)
        });

    } catch (err) {
        console.error('[Student Dashboard Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching dashboard data.'
        });
    }
});

module.exports = router;
