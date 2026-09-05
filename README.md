# Cloud Student Services (Cloud-Based Student Services System)

[![PaaS Platform](https://img.shields.io/badge/PaaS-Render-blue.svg)](https://render.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-68A063.svg)](https://expressjs.com)
[![Security](https://img.shields.io/badge/Security-Bcrypt%20%2B%20RBAC-red.svg)](#authentication--security)

A production-ready, cloud-native web application built for the **Cloud Computing & PaaS** university course. The platform provides streamlined course registration for students and administration management for university administrators.

---

## ☁️ 1. Project Overview

**Cloud Student Services** is an efficient web application designed to be deployed on a Platform as a Service (PaaS) infrastructure with a managed cloud relational database.

### Key Objectives:
- **Cloud Native Architecture**: Hosted on Render PaaS with PostgreSQL managed database.
- **Role-Based Workflows**: Separate, secure interfaces for Students and Administrators.
- **Academic Standard UI/UX**: Built on a unified, high-contrast design system (`#2563EB` cloud primary theme, Inter typography, micro-interactions, responsive sidebars).
- **Security & Integrity**: Password hashing via `bcryptjs`, parameterized SQL queries, and server-side authorization enforcement.

---

## 🏗️ 2. Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design Tokens), Vanilla JavaScript (Single Page Architecture).
- **Icons**: FontAwesome 6.4 (CDN).
- **Backend**: Node.js & Express.js.
- **Database**: PostgreSQL (Production) / Dynamic state adapter (Local zero-config dev mode).
- **Authentication**: Express Session with HTTP-Only cookies & Bcrypt password hashing.
- **Deployment & Hosting**: Render (PaaS Web Service + Render PostgreSQL).

---

## 🏛️ 3. Cloud Architecture Diagram

```
+-------------------------------------------------------------------+
|                        USERS & CLIENTS                            |
|             Student / Admin Web Browser / Mobile Device           |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS (SSL/TLS Encryption)
                                  v
+-------------------------------------------------------------------+
|                         INTERNET & DNS                            |
|                 https://cloud-student-services.onrender.com       |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     RENDER PLATFORM (PaaS)                        |
|  +-------------------------------------------------------------+  |
|  |                  Node.js Web Service                        |  |
|  |  • Express.js Server                                        |  |
|  |  • Authentication & RBAC Middleware                         |  |
|  |  • Request Logger & Health Monitor (/health)                 |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
                                  |
                                  | Secure Encrypted Database Connection
                                  v
+-------------------------------------------------------------------+
|                     CLOUD DATABASE SERVICE                        |
|  +-------------------------------------------------------------+  |
|  |                 PostgreSQL Database                         |  |
|  |  • Foreign Key Relational Integrity                         |  |
|  |  • Indexed Queries for Users, Students, Courses, Requests   |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 🗄️ 4. Database Schema & Entity Relationships

The PostgreSQL relational database contains 4 primary entities:

### Tables Specification:
1. `users`
   - `id`: `SERIAL PRIMARY KEY`
   - `email`: `VARCHAR(255) UNIQUE NOT NULL`
   - `password_hash`: `TEXT NOT NULL`
   - `role`: `VARCHAR(50) CHECK (role IN ('ADMIN', 'STUDENT'))`
   - `created_at`: `TIMESTAMP`

2. `students`
   - `id`: `SERIAL PRIMARY KEY`
   - `user_id`: `INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE`
   - `student_number`: `VARCHAR(50) UNIQUE NOT NULL`
   - `full_name`: `VARCHAR(255) NOT NULL`
   - `email`: `VARCHAR(255) NOT NULL`
   - `department`: `VARCHAR(100) NOT NULL`
   - `level`: `VARCHAR(50) NOT NULL`
   - `created_at`: `TIMESTAMP`

3. `courses`
   - `id`: `SERIAL PRIMARY KEY`
   - `course_code`: `VARCHAR(50) UNIQUE NOT NULL`
   - `course_name`: `VARCHAR(255) NOT NULL`
   - `credit_hours`: `INTEGER NOT NULL`
   - `instructor`: `VARCHAR(255) NOT NULL`
   - `available_seats`: `INTEGER NOT NULL`
   - `status`: `VARCHAR(50) DEFAULT 'AVAILABLE'`
   - `created_at`: `TIMESTAMP`

4. `registration_requests`
   - `id`: `SERIAL PRIMARY KEY`
   - `student_id`: `INTEGER REFERENCES students(id) ON DELETE CASCADE`
   - `course_id`: `INTEGER REFERENCES courses(id) ON DELETE CASCADE`
   - `status`: `VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))`
   - `requested_at`: `TIMESTAMP`
   - `processed_at`: `TIMESTAMP NULL`

---

## 🔐 5. Authentication & Security

- **Bcrypt Hashing**: User passwords are never stored in plain text. Hashed using salt rounds = 10.
- **Server-Side Authorization**: API routes `/api/admin/*` and `/api/student/*` check session context server-side.
- **SQL Injection Prevention**: All queries use parameterized inputs (`$1`, `$2`).
- **XSS & CORS Protection**: Static rendering with sanitized client state and restricted HTTP headers.

---

## 🔑 6. Demo Accounts

The database automatically initializes demo credentials on startup:

| Role | Email Address | Password | Description |
|---|---|---|---|
| **Admin** | `admin@example.com` | `admin123` | Full access to manage students, courses, and approve requests |
| **Student** | `student@example.com` | `student123` | Access to browse courses and submit registration requests |

---

## 🚀 7. Local Development Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Step-by-Step Instructions:

1. **Clone or Open Project Directory**:
   ```bash
   cd cloud-student-services
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Run Server**:
   ```bash
   npm start
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000).

*Note: If local PostgreSQL is not configured, the system automatically runs in zero-config local memory mode while maintaining full database query behavior.*

---

## ☁️ 8. Cloud Deployment to Render (PaaS)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Deploy Cloud Student Services System"
git remote add origin https://github.com/YOUR_USERNAME/cloud-student-services.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render
1. Log in to [Render Console](https://dashboard.render.com).
2. Click **New +** -> **PostgreSQL**.
3. Set Name: `cloud-student-db`.
4. Copy the **Internal Database URL** or **External Database URL**.

### Step 3: Deploy Web Service on Render
1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository `cloud-student-services`.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = `your_secure_random_string`
   - `DATABASE_URL` = *(Paste Render PostgreSQL URL)*
5. Click **Create Web Service**.

Once deployed, Render provides a Public URL:
`https://cloud-student-services.onrender.com`

---

## 📊 9. Cloud Monitoring & Logging

- **Request Diagnostics**: Server logs every incoming HTTP request method, URL, status code, latency (ms), and client IP.
- **Render Logs**: View live system activity directly under the Render Dashboard **Logs** tab.
- **Health Check Endpoint**: `/health` returns JSON server status and database connectivity.

---

## 🎓 10. University Cloud Computing Concepts Mapping

This project directly demonstrates core Cloud Computing curriculum topics:

1. **Cloud Deployment Model**: Public Cloud deployment accessible globally via HTTPS Public URL.
2. **Platform as a Service (PaaS)**: Managed app deployment using Render without manually managing Linux VMs or Apache/Nginx web server daemons.
3. **Cloud Database (DaaS)**: Managed PostgreSQL instance providing persistent relational storage with automated backups.
4. **Security & Identity**: Role-based access control, hashed credentials, encrypted environment variables (`.env`).
5. **Resource Monitoring**: Live diagnostic HTTP logging and automated health check status endpoint (`/health`).
