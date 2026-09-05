const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/courses - Retrieve Courses
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM courses ORDER BY course_code ASC');
        return res.json({
            success: true,
            courses: result.rows
        });
    } catch (err) {
        console.error('[Get Courses Error]:', err);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch courses list.'
        });
    }
});

module.exports = router;
