require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const db = require('./src/database/db');
const requestLogger = require('./src/middleware/logger');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin !== 'null') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'cloud_student_services_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 Hours
    }
}));

// Cloud Request Logging Middleware
app.use(requestLogger);

// Static Web Client Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint (For Cloud Deployment Monitoring on Render)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'Cloud Student Services API',
        timestamp: new Date().toISOString(),
        database: db.isMemory ? 'In-Memory Emulation' : 'PostgreSQL Cloud'
    });
});

// Single Page Application Fallback Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Cloud Application Error]:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again.'
    });
});

// Initialize Database & Boot Web Server
db.initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(` Cloud Student Services System is running!`);
        console.log(` Server URL: http://localhost:${PORT}`);
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(` Database Mode: ${db.isMemory ? 'Local Memory (No PG)' : 'PostgreSQL Connected'}`);
        console.log(`=======================================================`);
    });
}).catch(err => {
    console.error('Failed to initialize application database:', err);
});
