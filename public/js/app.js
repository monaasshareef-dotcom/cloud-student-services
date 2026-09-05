/* ==========================================================================
   Cloud Student Services - Client JavaScript Application Engine
   Single Page Application Architecture, API Integration & Bilingual Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Determine API Base URL dynamically
    const isFileProtocol = (window.location.protocol === 'file:' || window.location.origin === 'null');
    const API_BASE = isFileProtocol ? 'http://localhost:3000' : '';

    // --- Translations Dictionary (Bilingual EN / AR) ---
    const translations = {
        en: {
            appName: "Cloud Student Services",
            appSubtitle: "A cloud-native academic platform for seamless course registration and student administration.",
            welcomeBack: "Welcome Back",
            pleaseSignIn: "Please sign in to access your portal",
            emailAddress: "Email Address",
            password: "Password",
            signIn: "Sign In",
            demoCredentials: "Demo Credentials:",
            admin: "Admin",
            student: "Student",
            navDashboard: "Dashboard",
            navCourses: "Available Courses",
            navMyRequests: "My Requests",
            navManageStudents: "Manage Students",
            navManageCourses: "Manage Courses",
            navManageRequests: "Manage Requests",
            signOut: "Sign Out",
            welcomeStudent: "Welcome,",
            welcomeSubtitle: "Student Portal & Course Registration Overview",
            myCourses: "My Courses",
            totalRequests: "Total Requests",
            approvedCourses: "Approved Courses",
            recentRequests: "Recent Requests",
            courseCode: "Course Code",
            courseName: "Course Name",
            creditHours: "Credit Hours",
            instructor: "Instructor",
            seats: "Available Seats",
            status: "Status",
            action: "Action",
            requestedDate: "Date",
            requestRegistration: "Request Registration",
            unavailable: "Unavailable",
            searchCourses: "Search courses by code or title...",
            searchStudents: "Search students by ID, name or email...",
            addStudent: "Add Student",
            addCourse: "Add Course",
            totalStudents: "Total Students",
            totalCourses: "Total Courses",
            pendingRequests: "Pending Requests",
            approvedRequests: "Approved Requests",
            studentId: "Student ID",
            fullName: "Full Name",
            department: "Department",
            level: "Level",
            edit: "Edit",
            delete: "Delete",
            approve: "Approve",
            reject: "Reject",
            cancel: "Cancel",
            saveStudent: "Save Student",
            saveCourse: "Save Course",
            submitRequest: "Submit Request",
            accountPassword: "Account Password",
            availableSeats: "Available Seats",
            deleteConfirmTitle: "Confirm Delete",
            deleteConfirmMessage: "Are you sure you want to delete this record? This action cannot be undone.",
            confirmCourseTitle: "Confirm Course Request",
            confirmCourseMsg: "Are you sure you want to submit a registration request for this course?",
            badgePending: "Pending",
            badgeApproved: "Approved",
            badgeRejected: "Rejected",
            badgeAvailable: "Available",
            badgeUnavailable: "Unavailable",
            langBtnLabel: "العربية",
            serverRunningTip: "Tip: To connect to live Node.js server, launch تشغيل_السيرفر.bat and open http://localhost:3000."
        },
        ar: {
            appName: "خدمات الطلاب السحابية",
            appSubtitle: "منصة أكاديمية سحابية لتسجيل المواد وإدارة الطلاب بسهولة وأمان.",
            welcomeBack: "مرحباً بعودتك",
            pleaseSignIn: "يرجى تسجيل الدخول للوصول إلى البوابة الأكاديمية",
            emailAddress: "البريد الإلكتروني",
            password: "كلمة المرور",
            signIn: "تسجيل الدخول",
            demoCredentials: "بيانات الحسابات التجريبية:",
            admin: "مسؤول (أدمن)",
            student: "طالب",
            navDashboard: "لوحة التحكم",
            navCourses: "المواد المتاحة",
            navMyRequests: "طلباتي",
            navManageStudents: "إدارة الطلاب",
            navManageCourses: "إدارة المواد",
            navManageRequests: "إدارة الطلبات",
            signOut: "تسجيل الخروج",
            welcomeStudent: "مرحباً بك،",
            welcomeSubtitle: "إليك ملخص خدماتك الأكاديمية وطلبات التسجيل.",
            myCourses: "موادي المسجلة",
            totalRequests: "إجمالي الطلبات",
            approvedCourses: "المواد المقبولة",
            recentRequests: "أحدث طلبات التسجيل",
            courseCode: "رمز المادة",
            courseName: "اسم المادة",
            creditHours: "الساعات المعتمدة",
            instructor: "المحاضر / الدكتور",
            seats: "المقاعد المتاحة",
            status: "الحالة",
            action: "الإجراء",
            requestedDate: "التاريخ",
            requestRegistration: "طلب تسجيل المادة",
            unavailable: "غير متاح",
            searchCourses: "ابحث عن مادة بواسطة الرمز أو الاسم...",
            searchStudents: "ابحث عن طالب برقم القيد أو الاسم...",
            addStudent: "إضافة طالب جديد",
            addCourse: "إضافة مادة جديدة",
            totalStudents: "إجمالي الطلاب",
            totalCourses: "إجمالي المواد",
            pendingRequests: "طلبات قيد الانتظار",
            approvedRequests: "طلبات مقبولة",
            studentId: "الرقم الجامعي",
            fullName: "الاسم الكامل",
            department: "القسم / التخصص",
            level: "المستوى الدراسي",
            edit: "تعديل",
            delete: "حذف",
            approve: "موافقة",
            reject: "رفض",
            cancel: "إلغاء",
            saveStudent: "حفظ بيانات الطالب",
            saveCourse: "حفظ بيانات المادة",
            submitRequest: "إرسال طلب التسجيل",
            accountPassword: "كلمة مرور الحساب",
            availableSeats: "عدد المقاعد المتاحة",
            deleteConfirmTitle: "تأكيد الحذف",
            deleteConfirmMessage: "هل أنت تأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.",
            confirmCourseTitle: "تأكيد طلب تسجيل المادة",
            confirmCourseMsg: "هل أنت تأكد من رغبتك في إرسال طلب تسجيل لهذه المادة؟",
            badgePending: "قيد الانتظار",
            badgeApproved: "مقبول",
            badgeRejected: "مرفوض",
            badgeAvailable: "متاح",
            badgeUnavailable: "غير متاح",
            langBtnLabel: "English",
            serverRunningTip: "تلميح: لتشغيل خادم Node.js الكامل، اضغط مرتين على تشغيل_السيرفر.bat وافتح http://localhost:3000."
        }
    };

    // Current Language State
    let currentLang = localStorage.getItem('app_lang') || 'en';

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || key;
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('app_lang', lang);

        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Translate text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update Toggle Buttons Label
        const nextLangLabel = lang === 'en' ? 'العربية' : 'English';
        const loginLabel = document.getElementById('login-lang-toggle-label');
        const headerLabel = document.getElementById('header-lang-toggle-label');
        if (loginLabel) loginLabel.textContent = nextLangLabel;
        if (headerLabel) headerLabel.textContent = nextLangLabel;

        // Refresh Active View Data if logged in
        if (currentView) {
            loadViewData(currentView);
        }
    }

    // Language Toggle Event Handlers
    const loginLangBtn = document.getElementById('login-lang-toggle-btn');
    const headerLangBtn = document.getElementById('header-lang-toggle-btn');

    if (loginLangBtn) {
        loginLangBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    if (headerLangBtn) {
        headerLangBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    // --- Application State ---
    let currentUser = null;
    let currentView = null;
    let selectedCourseForRequest = null;
    let pendingDeleteAction = null;

    // Cache Data Sets for Search Filtering
    let cacheStudents = [];
    let cacheCourses = [];

    // --- DOM Elements ---
    const loginView = document.getElementById('login-view');
    const appLayout = document.getElementById('app-layout');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    const studentNav = document.getElementById('student-nav');
    const adminNav = document.getElementById('admin-nav');
    const pageTitleEl = document.getElementById('page-title');

    const userAvatarEl = document.getElementById('user-avatar');
    const userNameEl = document.getElementById('user-display-name');
    const userRoleEl = document.getElementById('user-display-role');

    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const sidebarEl = document.getElementById('sidebar');

    // Modals
    const requestCourseModal = document.getElementById('request-course-modal');
    const studentFormModal = document.getElementById('student-form-modal');
    const courseFormModal = document.getElementById('course-form-modal');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');

    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // ==========================================================================
    // STANDALONE / OFFLINE CLIENT-SIDE MOCK DATABASE ENGINE
    // Activates automatically if Node.js server is unreachable or in file:// mode
    // ==========================================================================
    const MOCK_STORAGE_KEY = 'css_mock_database_v1';
    let isMockMode = false;

    function getMockDb() {
        let stored = localStorage.getItem(MOCK_STORAGE_KEY);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        const initial = {
            users: [
                { id: 1, email: 'admin@example.com', password: 'admin123', role: 'ADMIN', name: 'Administrator' },
                { id: 2, email: 'student@example.com', password: 'student123', role: 'STUDENT', studentId: 1, name: 'Ahmed Ali', studentNumber: '2024001', department: 'Computer Science', level: 'Level 3' },
                { id: 3, email: 'sara@example.com', password: 'student123', role: 'STUDENT', studentId: 2, name: 'Sara Mohammed', studentNumber: '2024002', department: 'Information Systems', level: 'Level 4' }
            ],
            students: [
                { id: 1, user_id: 2, student_number: '2024001', full_name: 'Ahmed Ali', email: 'student@example.com', department: 'Computer Science', level: 'Level 3', created_at: new Date().toISOString() },
                { id: 2, user_id: 3, student_number: '2024002', full_name: 'Sara Mohammed', email: 'sara@example.com', department: 'Information Systems', level: 'Level 4', created_at: new Date().toISOString() }
            ],
            courses: [
                { id: 1, course_code: 'CS101', course_name: 'Introduction to Programming', credit_hours: 3, instructor: 'Dr. Sarah Connor', available_seats: 25, status: 'AVAILABLE' },
                { id: 2, course_code: 'DB201', course_name: 'Database Systems & Cloud SQL', credit_hours: 4, instructor: 'Prof. Robert Lang', available_seats: 18, status: 'AVAILABLE' },
                { id: 3, course_code: 'NET202', course_name: 'Computer Networks & Security', credit_hours: 3, instructor: 'Dr. Michael Chang', available_seats: 30, status: 'AVAILABLE' },
                { id: 4, course_code: 'WEB203', course_name: 'Web Development & Modern APIs', credit_hours: 3, instructor: 'Eng. Mona Ahmed', available_seats: 0, status: 'UNAVAILABLE' },
                { id: 5, course_code: 'CLOUD301', course_name: 'Cloud Computing & PaaS Architecture', credit_hours: 4, instructor: 'Dr. Alex Vance', available_seats: 15, status: 'AVAILABLE' }
            ],
            requests: [
                { id: 1, student_id: 1, course_id: 1, status: 'APPROVED', requested_at: new Date(Date.now() - 86400000 * 2).toISOString(), processed_at: new Date(Date.now() - 86400000).toISOString() },
                { id: 2, student_id: 1, course_id: 2, status: 'PENDING', requested_at: new Date(Date.now() - 3600000 * 4).toISOString(), processed_at: null },
                { id: 3, student_id: 2, course_id: 3, status: 'PENDING', requested_at: new Date(Date.now() - 3600000 * 2).toISOString(), processed_at: null }
            ],
            nextId: { students: 3, courses: 6, requests: 4, users: 4 }
        };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initial));
        return initial;
    }

    function saveMockDb(db) {
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    }

    function handleMockRequest(endpoint, options = {}) {
        isMockMode = true;
        const method = (options.method || 'GET').toUpperCase();
        let body = {};
        if (options.body) {
            try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body; } catch(e){}
        }
        const db = getMockDb();

        // 1. Auth: POST /api/auth/login
        if (endpoint === '/api/auth/login' && method === 'POST') {
            const email = (body.email || '').trim().toLowerCase();
            const user = db.users.find(u => u.email.toLowerCase() === email);
            if (user && user.password === body.password) {
                const sessionUser = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    studentId: user.studentId || null,
                    name: user.name,
                    studentNumber: user.studentNumber || null,
                    department: user.department || null,
                    level: user.level || null
                };
                localStorage.setItem('mock_session_user', JSON.stringify(sessionUser));
                return { success: true, user: sessionUser, token: 'mock-token-' + user.id };
            }
            return { success: false, message: currentLang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.' };
        }

        // 2. Auth: GET /api/auth/me
        if (endpoint === '/api/auth/me') {
            const stored = localStorage.getItem('mock_session_user');
            if (stored) {
                return { success: true, user: JSON.parse(stored) };
            }
            return { success: false, user: null };
        }

        // 3. Auth: POST /api/auth/logout
        if (endpoint === '/api/auth/logout') {
            localStorage.removeItem('mock_session_user');
            return { success: true };
        }

        const sessionUser = JSON.parse(localStorage.getItem('mock_session_user') || 'null');

        // 4. Student: GET /api/student/dashboard
        if (endpoint === '/api/student/dashboard') {
            const stId = sessionUser ? sessionUser.studentId : 1;
            const studentReqs = db.requests
                .filter(r => r.student_id === stId)
                .map(r => {
                    const c = db.courses.find(co => co.id === r.course_id) || {};
                    return { ...r, course_code: c.course_code || '---', course_name: c.course_name || '---', credit_hours: c.credit_hours || 0, instructor: c.instructor || '---' };
                })
                .sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));

            const approvedCount = studentReqs.filter(r => r.status === 'APPROVED').length;
            return {
                success: true,
                summary: {
                    myCourses: approvedCount,
                    requests: studentReqs.length,
                    approved: approvedCount,
                    pending: studentReqs.filter(r => r.status === 'PENDING').length
                },
                recentRequests: studentReqs.slice(0, 5)
            };
        }

        // 5. Courses: GET /api/courses
        if (endpoint === '/api/courses' && method === 'GET') {
            return { success: true, courses: db.courses };
        }

        // 6. Student Requests: GET /api/requests/my
        if (endpoint === '/api/requests/my') {
            const stId = sessionUser ? sessionUser.studentId : 1;
            const reqs = db.requests
                .filter(r => r.student_id === stId)
                .map(r => {
                    const c = db.courses.find(co => co.id === r.course_id) || {};
                    return { ...r, course_code: c.course_code || '---', course_name: c.course_name || '---', credit_hours: c.credit_hours || 0, instructor: c.instructor || '---' };
                })
                .sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
            return { success: true, requests: reqs };
        }

        // 7. Submit Request: POST /api/requests
        if (endpoint === '/api/requests' && method === 'POST') {
            const stId = sessionUser ? sessionUser.studentId : 1;
            const courseId = parseInt(body.courseId, 10);
            const course = db.courses.find(c => c.id === courseId);
            if (!course) return { success: false, message: 'المادة غير موجودة.' };

            const existing = db.requests.find(r => r.student_id === stId && r.course_id === courseId);
            if (existing) {
                return { success: false, message: currentLang === 'ar' ? `تم تقديم طلب لهذه المادة مسبقاً (${existing.status}).` : `Request already submitted (${existing.status}).` };
            }

            const newReq = {
                id: db.nextId.requests++,
                student_id: stId,
                course_id: courseId,
                status: 'PENDING',
                requested_at: new Date().toISOString(),
                processed_at: null
            };
            db.requests.unshift(newReq);
            saveMockDb(db);
            return { success: true, message: 'تم إرسال طلب التسجيل بنجاح.', request: newReq };
        }

        // 8. Admin Dashboard: GET /api/admin/dashboard
        if (endpoint === '/api/admin/dashboard') {
            const recent = db.requests.map(r => {
                const s = db.students.find(st => st.id === r.student_id) || {};
                const c = db.courses.find(co => co.id === r.course_id) || {};
                return {
                    ...r,
                    student_name: s.full_name || '---',
                    student_number: s.student_number || '---',
                    course_code: c.course_code || '---',
                    course_name: c.course_name || '---'
                };
            }).sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at)).slice(0, 6);

            return {
                success: true,
                summary: {
                    totalStudents: db.students.length,
                    totalCourses: db.courses.length,
                    pendingRequests: db.requests.filter(r => r.status === 'PENDING').length,
                    approvedRequests: db.requests.filter(r => r.status === 'APPROVED').length
                },
                recentRequests: recent
            };
        }

        // 9. Admin Students: GET, POST, PUT, DELETE
        if (endpoint === '/api/admin/students' && method === 'GET') {
            return { success: true, students: db.students };
        }
        if (endpoint === '/api/admin/students' && method === 'POST') {
            const newSt = {
                id: db.nextId.students++,
                user_id: db.nextId.users++,
                student_number: body.studentNumber,
                full_name: body.fullName,
                email: body.email,
                department: body.department,
                level: body.level,
                created_at: new Date().toISOString()
            };
            db.students.push(newSt);
            db.users.push({
                id: newSt.user_id,
                email: body.email,
                password: body.password || '123456',
                role: 'STUDENT',
                studentId: newSt.id,
                name: body.fullName,
                studentNumber: body.studentNumber,
                department: body.department,
                level: body.level
            });
            saveMockDb(db);
            return { success: true, student: newSt };
        }
        if (endpoint.startsWith('/api/admin/students/') && method === 'PUT') {
            const id = parseInt(endpoint.split('/').pop(), 10);
            const idx = db.students.findIndex(s => s.id === id);
            if (idx !== -1) {
                db.students[idx] = { ...db.students[idx], ...body, full_name: body.fullName, student_number: body.studentNumber };
                saveMockDb(db);
                return { success: true, student: db.students[idx] };
            }
            return { success: false, message: 'Student not found.' };
        }
        if (endpoint.startsWith('/api/admin/students/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/').pop(), 10);
            db.students = db.students.filter(s => s.id !== id);
            db.requests = db.requests.filter(r => r.student_id !== id);
            saveMockDb(db);
            return { success: true };
        }

        // 10. Admin Courses: GET, POST, PUT, DELETE
        if (endpoint === '/api/admin/courses' && method === 'POST') {
            const newCourse = {
                id: db.nextId.courses++,
                course_code: body.courseCode,
                course_name: body.courseName,
                credit_hours: parseInt(body.creditHours, 10) || 3,
                instructor: body.instructor,
                available_seats: parseInt(body.availableSeats, 10) || 0,
                status: body.status || 'AVAILABLE'
            };
            db.courses.push(newCourse);
            saveMockDb(db);
            return { success: true, course: newCourse };
        }
        if (endpoint.startsWith('/api/admin/courses/') && method === 'PUT') {
            const id = parseInt(endpoint.split('/').pop(), 10);
            const idx = db.courses.findIndex(c => c.id === id);
            if (idx !== -1) {
                db.courses[idx] = {
                    ...db.courses[idx],
                    course_code: body.courseCode,
                    course_name: body.courseName,
                    credit_hours: parseInt(body.creditHours, 10),
                    instructor: body.instructor,
                    available_seats: parseInt(body.availableSeats, 10),
                    status: body.status
                };
                saveMockDb(db);
                return { success: true, course: db.courses[idx] };
            }
            return { success: false, message: 'Course not found.' };
        }
        if (endpoint.startsWith('/api/admin/courses/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/').pop(), 10);
            db.courses = db.courses.filter(c => c.id !== id);
            db.requests = db.requests.filter(r => r.course_id !== id);
            saveMockDb(db);
            return { success: true };
        }

        // 11. Admin Requests: GET, PATCH
        if (endpoint === '/api/admin/requests' && method === 'GET') {
            const list = db.requests.map(r => {
                const s = db.students.find(st => st.id === r.student_id) || {};
                const c = db.courses.find(co => co.id === r.course_id) || {};
                return {
                    ...r,
                    student_name: s.full_name || '---',
                    student_number: s.student_number || '---',
                    course_code: c.course_code || '---',
                    course_name: c.course_name || '---'
                };
            }).sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
            return { success: true, requests: list };
        }
        if (endpoint.includes('/approve') && method === 'PATCH') {
            const id = parseInt(endpoint.split('/')[4], 10);
            const reqItem = db.requests.find(r => r.id === id);
            if (reqItem) {
                reqItem.status = 'APPROVED';
                reqItem.processed_at = new Date().toISOString();
                saveMockDb(db);
                return { success: true, message: 'Request approved.' };
            }
            return { success: false, message: 'Request not found.' };
        }
        if (endpoint.includes('/reject') && method === 'PATCH') {
            const id = parseInt(endpoint.split('/')[4], 10);
            const reqItem = db.requests.find(r => r.id === id);
            if (reqItem) {
                reqItem.status = 'REJECTED';
                reqItem.processed_at = new Date().toISOString();
                saveMockDb(db);
                return { success: true, message: 'Request rejected.' };
            }
            return { success: false, message: 'Request not found.' };
        }

        return { success: true };
    }

    // --- Fetch Wrapper Helper with Seamless Fallback ---
    async function apiFetch(endpoint, options = {}) {
        if (isMockMode) {
            const mockData = handleMockRequest(endpoint, options);
            return {
                ok: mockData.success !== false,
                status: mockData.success === false ? 400 : 200,
                json: async () => mockData
            };
        }

        const token = localStorage.getItem('authToken');
        const defaultOptions = {
            credentials: isFileProtocol ? 'omit' : 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'x-auth-token': token } : {})
            }
        };
        const mergedOptions = { ...defaultOptions, ...options };
        if (options.headers) {
            mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, mergedOptions);
            if (!res.ok && isFileProtocol) {
                const cloneRes = res.clone();
                const data = await cloneRes.json().catch(() => null);
                if (!data) throw new Error('Invalid server response');
            }
            return res;
        } catch (fetchErr) {
            console.warn(`[Client Engine] Offline or file protocol mode active for ${endpoint}.`);
            const mockData = handleMockRequest(endpoint, options);
            return {
                ok: mockData.success !== false,
                status: mockData.success === false ? 400 : 200,
                json: async () => mockData
            };
        }
    }

    // --- Toast Notification Helper ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- Format Helpers ---
    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function getStatusBadge(status) {
        const s = (status || '').toUpperCase();
        if (s === 'PENDING') return `<span class="badge badge-pending"><i class="fa-solid fa-hourglass-half"></i> ${t('badgePending')}</span>`;
        if (s === 'APPROVED') return `<span class="badge badge-approved"><i class="fa-solid fa-check"></i> ${t('badgeApproved')}</span>`;
        if (s === 'REJECTED') return `<span class="badge badge-rejected"><i class="fa-solid fa-xmark"></i> ${t('badgeRejected')}</span>`;
        if (s === 'AVAILABLE') return `<span class="badge badge-available"><i class="fa-solid fa-circle-check"></i> ${t('badgeAvailable')}</span>`;
        if (s === 'UNAVAILABLE') return `<span class="badge badge-unavailable"><i class="fa-solid fa-circle-minus"></i> ${t('badgeUnavailable')}</span>`;
        return `<span class="badge">${status}</span>`;
    }

    // --- Initialization & Session Check ---
    async function checkSession() {
        try {
            const res = await apiFetch('/api/auth/me');
            const data = await res.json();

            if (data.success && data.user) {
                currentUser = data.user;
                renderAppLayout();
            } else {
                showLoginView();
            }
        } catch (err) {
            console.error('Session check failed:', err);
            showLoginView();
        }
    }

    function showLoginView() {
        currentUser = null;
        loginView.style.display = 'flex';
        appLayout.style.display = 'none';
    }

    function renderAppLayout() {
        loginView.style.display = 'none';
        appLayout.style.display = 'flex';

        // Set User Profile Info
        userNameEl.textContent = currentUser.name || currentUser.email;
        userRoleEl.textContent = currentUser.role === 'ADMIN' ? t('admin') : t('student');
        userAvatarEl.textContent = (currentUser.name || currentUser.email).charAt(0).toUpperCase();

        if (currentUser.role === 'STUDENT') {
            studentNav.style.display = 'flex';
            adminNav.style.display = 'none';
            document.getElementById('student-welcome-name').textContent = (currentUser.name || '').split(' ')[0];
            switchView('student-dashboard');
        } else if (currentUser.role === 'ADMIN') {
            studentNav.style.display = 'none';
            adminNav.style.display = 'flex';
            switchView('admin-dashboard');
        }
    }

    // --- View Navigation System ---
    function switchView(viewId) {
        currentView = viewId;

        // Hide all views
        document.querySelectorAll('.view-section').forEach(sec => sec.style.display = 'none');

        // Deactivate all nav items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

        // Close Mobile Sidebar
        sidebarEl.classList.remove('mobile-open');

        // Show Target View & Highlight Nav
        const targetView = document.getElementById(`${viewId}-view`);
        if (targetView) targetView.style.display = 'block';

        const activeNavItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');

        // Set Header Title
        const titlesMap = {
            'student-dashboard': t('navDashboard'),
            'student-courses': t('navCourses'),
            'student-requests': t('navMyRequests'),
            'admin-dashboard': t('navDashboard'),
            'admin-students': t('navManageStudents'),
            'admin-courses': t('navManageCourses'),
            'admin-requests': t('navManageRequests')
        };
        pageTitleEl.textContent = titlesMap[viewId] || t('portal');

        // Load Data for View
        loadViewData(viewId);
    }

    function loadViewData(viewId) {
        switch (viewId) {
            case 'student-dashboard':
                loadStudentDashboard();
                break;
            case 'student-courses':
                loadStudentCourses();
                break;
            case 'student-requests':
                loadStudentRequests();
                break;
            case 'admin-dashboard':
                loadAdminDashboard();
                break;
            case 'admin-students':
                loadAdminStudents();
                break;
            case 'admin-courses':
                loadAdminCourses();
                break;
            case 'admin-requests':
                loadAdminRequests();
                break;
        }
    }

    // Global Event Delegation for Navigation Buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-view]');
        if (trigger) {
            const view = trigger.getAttribute('data-view');
            switchView(view);
        }
    });

    // Mobile Menu Toggle
    mobileToggleBtn.addEventListener('click', () => {
        sidebarEl.classList.toggle('mobile-open');
    });

    // --- Authentication Event Handlers ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('login-btn');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner" style="width:18px;height:18px;border-width:2px;"></div> Loading...`;

        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                currentUser = data.user;
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                const demoBadge = isMockMode ? (currentLang === 'ar' ? ' (الوضع التجريبي)' : ' (Demo Mode)') : '';
                showToast(`${currentLang === 'ar' ? 'مرحباً بعودتك،' : 'Welcome back,'} ${currentUser.name}!${demoBadge}`, 'success');
                renderAppLayout();
            } else {
                showToast(data.message || (currentLang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid login credentials.'), 'error');
            }
        } catch (err) {
            showToast(currentLang === 'ar' ? 'عذراً، تعذر الاتصال بالسيرفر.' : 'Unable to connect to server. Ensure Node server is running.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span data-i18n="signIn">${t('signIn')}</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await apiFetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {}
        localStorage.removeItem('authToken');
        showToast(currentLang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.', 'success');
        showLoginView();
    });

    // ==========================================================================
    // STUDENT CONTROLLERS
    // ==========================================================================

    // 1. Student Dashboard
    async function loadStudentDashboard() {
        try {
            const res = await apiFetch('/api/student/dashboard');
            const data = await res.json();

            if (data.success) {
                document.getElementById('metric-student-courses').textContent = data.summary.myCourses;
                document.getElementById('metric-student-requests').textContent = data.summary.requests;
                document.getElementById('metric-student-approved').textContent = data.summary.approved;

                const tbody = document.getElementById('student-recent-requests-tbody');
                if (data.recentRequests.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="4">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i class="fa-solid fa-inbox"></i></div>
                                    <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد طلبات جديدة' : 'No Recent Requests'}</div>
                                    <div class="empty-state-text">${currentLang === 'ar' ? 'لم تقم بإرسال أي طلبات تسجيل مواد حتى الآن.' : 'You have not submitted any registration requests yet.'}</div>
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                tbody.innerHTML = data.recentRequests.map(r => `
                    <tr>
                        <td><strong>${r.course_code}</strong></td>
                        <td>${r.course_name}</td>
                        <td>${formatDate(r.requested_at)}</td>
                        <td>${getStatusBadge(r.status)}</td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Error loading student dashboard:', err);
        }
    }

    // 2. Available Courses Page
    async function loadStudentCourses() {
        try {
            const res = await apiFetch('/api/courses');
            const data = await res.json();

            if (data.success) {
                cacheCourses = data.courses;
                renderStudentCoursesTable(cacheCourses);
            }
        } catch (err) {
            console.error('Error loading courses:', err);
        }
    }

    function renderStudentCoursesTable(courses) {
        const tbody = document.getElementById('student-courses-tbody');
        if (courses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fa-solid fa-book-open"></i></div>
                            <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد مواد متاحة' : 'No Courses Found'}</div>
                            <div class="empty-state-text">${currentLang === 'ar' ? 'لا توجد مواد أكاديمية متاحة للتسجيل حالياً.' : 'There are currently no available academic courses.'}</div>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = courses.map(c => {
            const isAvailable = c.status === 'AVAILABLE' && c.available_seats > 0;
            const actionBtn = isAvailable
                ? `<button class="btn btn-primary btn-sm request-btn" data-id="${c.id}">
                        <i class="fa-solid fa-plus"></i> ${t('requestRegistration')}
                   </button>`
                : `<span class="badge badge-unavailable">${t('unavailable')}</span>`;

            return `
                <tr>
                    <td><strong>${c.course_code}</strong></td>
                    <td>${c.course_name}</td>
                    <td>${c.credit_hours} ${currentLang === 'ar' ? 'ساعات' : 'Hours'}</td>
                    <td>${c.instructor}</td>
                    <td>${c.available_seats} ${currentLang === 'ar' ? 'مقاعد' : 'Seats'}</td>
                    <td>${getStatusBadge(c.status)}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        }).join('');

        // Bind Request Buttons
        tbody.querySelectorAll('.request-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.currentTarget.getAttribute('data-id');
                selectedCourseForRequest = cacheCourses.find(c => c.id == courseId);
                if (selectedCourseForRequest) {
                    document.getElementById('modal-course-code').textContent = selectedCourseForRequest.course_code;
                    document.getElementById('modal-course-name').textContent = selectedCourseForRequest.course_name;
                    document.getElementById('modal-course-credits').textContent = `${selectedCourseForRequest.credit_hours} ${currentLang === 'ar' ? 'ساعات' : 'Hours'}`;
                    document.getElementById('modal-course-instructor').textContent = selectedCourseForRequest.instructor;
                    openModal(requestCourseModal);
                }
            });
        });
    }

    // Submit Registration Request Confirmation
    document.getElementById('confirm-submit-request-btn').addEventListener('click', async () => {
        if (!selectedCourseForRequest) return;

        const btn = document.getElementById('confirm-submit-request-btn');
        btn.disabled = true;

        try {
            const res = await apiFetch('/api/requests', {
                method: 'POST',
                body: JSON.stringify({ courseId: selectedCourseForRequest.id })
            });

            const data = await res.json();
            closeModal(requestCourseModal);

            if (data.success) {
                showToast(currentLang === 'ar' ? 'تم إرسال طلب تسجيل المادة بنجاح.' : 'Registration request submitted successfully.', 'success');
                switchView('student-requests');
            } else {
                showToast(data.message || 'Unable to submit request.', 'error');
            }
        } catch (err) {
            showToast(currentLang === 'ar' ? 'حدث خطأ في السيرفر عند إرسال الطلب.' : 'Server error while submitting request.', 'error');
        } finally {
            btn.disabled = false;
        }
    });

    // 3. Student My Requests Page
    async function loadStudentRequests() {
        try {
            const res = await apiFetch('/api/requests/my');
            const data = await res.json();

            if (data.success) {
                const tbody = document.getElementById('student-my-requests-tbody');
                if (data.requests.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="4">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i class="fa-solid fa-paper-plane"></i></div>
                                    <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد طلبات مسجلة' : 'No Registration Requests Found'}</div>
                                    <div class="empty-state-text">${currentLang === 'ar' ? 'لم تقم بتقديم طلبات تسجيل لأي مواد حتى الآن.' : 'You haven\'t requested any courses yet.'}</div>
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                tbody.innerHTML = data.requests.map(r => `
                    <tr>
                        <td>#REQ-${String(r.id).padStart(4, '0')}</td>
                        <td>
                            <strong>${r.course_code}</strong> - ${r.course_name}<br>
                            <span style="font-size:12px; color:var(--text-secondary);">${r.instructor}</span>
                        </td>
                        <td>${formatDate(r.requested_at)}</td>
                        <td>${getStatusBadge(r.status)}</td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Error loading my requests:', err);
        }
    }

    // Search filter student courses
    document.getElementById('search-student-courses').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = cacheCourses.filter(c => 
            c.course_code.toLowerCase().includes(query) ||
            c.course_name.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query)
        );
        renderStudentCoursesTable(filtered);
    });

    // ==========================================================================
    // ADMIN CONTROLLERS
    // ==========================================================================

    // 1. Admin Dashboard
    async function loadAdminDashboard() {
        try {
            const res = await apiFetch('/api/admin/dashboard');
            const data = await res.json();

            if (data.success) {
                document.getElementById('metric-admin-students').textContent = data.summary.totalStudents;
                document.getElementById('metric-admin-courses').textContent = data.summary.totalCourses;
                document.getElementById('metric-admin-pending').textContent = data.summary.pendingRequests;
                document.getElementById('metric-admin-approved').textContent = data.summary.approvedRequests;

                const tbody = document.getElementById('admin-dashboard-requests-tbody');
                if (data.recentRequests.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="5">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i class="fa-solid fa-list-check"></i></div>
                                    <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد طلبات جديدة' : 'No Registration Requests'}</div>
                                    <div class="empty-state-text">${currentLang === 'ar' ? 'لا توجد طلبات تسجيل معلقة للعرض.' : 'No pending registration requests to show.'}</div>
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                tbody.innerHTML = data.recentRequests.map(r => {
                    const isPending = r.status === 'PENDING';
                    const actions = isPending ? `
                        <button class="btn btn-primary btn-sm approve-req-btn" data-id="${r.id}">${t('approve')}</button>
                        <button class="btn btn-danger btn-sm reject-req-btn" data-id="${r.id}">${t('reject')}</button>
                    ` : `<span style="font-size:12px; color:var(--text-secondary);">${getStatusBadge(r.status)}</span>`;

                    return `
                        <tr>
                            <td><strong>${r.student_name}</strong><br><span style="font-size:12px;color:var(--text-secondary);">${r.student_number}</span></td>
                            <td><strong>${r.course_code}</strong> - ${r.course_name}</td>
                            <td>${formatDate(r.requested_at)}</td>
                            <td>${getStatusBadge(r.status)}</td>
                            <td>${actions}</td>
                        </tr>
                    `;
                }).join('');

                bindRequestActionButtons(tbody);
            }
        } catch (err) {
            console.error('Error loading admin dashboard:', err);
        }
    }

    // 2. Admin Manage Students
    async function loadAdminStudents() {
        try {
            const res = await apiFetch('/api/admin/students');
            const data = await res.json();

            if (data.success) {
                cacheStudents = data.students;
                renderAdminStudentsTable(cacheStudents);
            }
        } catch (err) {
            console.error('Error loading admin students:', err);
        }
    }

    function renderAdminStudentsTable(students) {
        const tbody = document.getElementById('admin-students-tbody');
        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fa-solid fa-users"></i></div>
                            <div class="empty-state-title">${currentLang === 'ar' ? 'لا يوجد طلاب مسجلون' : 'No Students Registered'}</div>
                            <div class="empty-state-text">${currentLang === 'ar' ? 'اضغط "إضافة طالب جديد" لإنشاء حساب طالب.' : 'Click "Add Student" to create a new student account.'}</div>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = students.map(s => `
            <tr>
                <td><strong>${s.student_number}</strong></td>
                <td>${s.full_name}</td>
                <td>${s.email}</td>
                <td>${s.department}</td>
                <td>${s.level}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-student-btn" data-id="${s.id}"><i class="fa-solid fa-pen"></i> ${t('edit')}</button>
                    <button class="btn btn-danger btn-sm delete-student-btn" data-id="${s.id}"><i class="fa-solid fa-trash"></i> ${t('delete')}</button>
                </td>
            </tr>
        `).join('');

        // Bind Edit & Delete buttons
        tbody.querySelectorAll('.edit-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const student = cacheStudents.find(s => s.id == id);
                if (student) openStudentFormModal(student);
            });
        });

        tbody.querySelectorAll('.delete-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const student = cacheStudents.find(s => s.id == id);
                if (student) {
                    pendingDeleteAction = async () => {
                        try {
                            const res = await apiFetch(`/api/admin/students/${id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (data.success) {
                                showToast(currentLang === 'ar' ? 'تم حذف حساب الطالب بنجاح.' : 'Student deleted successfully.', 'success');
                                loadAdminStudents();
                            } else {
                                showToast(data.message || 'Unable to delete student.', 'error');
                            }
                        } catch (err) {
                            showToast(currentLang === 'ar' ? 'خطأ في السيرفر عند حذف الطالب.' : 'Server error while deleting student.', 'error');
                        }
                    };
                    document.getElementById('delete-modal-message').textContent = currentLang === 'ar'
                        ? `هل أنت تأكد من رغبتك في حذف الطالب "${student.full_name}" (${student.student_number})؟`
                        : `Are you sure you want to delete student "${student.full_name}" (${student.student_number})?`;
                    openModal(confirmDeleteModal);
                }
            });
        });
    }

    // Add Student Form Setup
    document.getElementById('open-add-student-btn').addEventListener('click', () => {
        openStudentFormModal(null);
    });

    function openStudentFormModal(student) {
        const titleEl = document.getElementById('student-modal-title');
        const pwdContainer = document.getElementById('student-password-container');

        if (student) {
            titleEl.textContent = currentLang === 'ar' ? 'تعديل بيانات طالب' : 'Edit Student';
            document.getElementById('student-form-id').value = student.id;
            document.getElementById('student-form-number').value = student.student_number;
            document.getElementById('student-form-name').value = student.full_name;
            document.getElementById('student-form-email').value = student.email;
            document.getElementById('student-form-dept').value = student.department;
            document.getElementById('student-form-level').value = student.level;
            pwdContainer.style.display = 'none';
        } else {
            titleEl.textContent = currentLang === 'ar' ? 'إضافة طالب جديد' : 'Add New Student';
            document.getElementById('student-form').reset();
            document.getElementById('student-form-id').value = '';
            pwdContainer.style.display = 'block';
            document.getElementById('student-form-password').required = true;
        }

        openModal(studentFormModal);
    }

    document.getElementById('student-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('student-form-id').value;
        const payload = {
            studentNumber: document.getElementById('student-form-number').value,
            fullName: document.getElementById('student-form-name').value,
            email: document.getElementById('student-form-email').value,
            department: document.getElementById('student-form-dept').value,
            level: document.getElementById('student-form-level').value,
            password: document.getElementById('student-form-password').value
        };

        const isEdit = Boolean(id);
        const url = isEdit ? `/api/admin/students/${id}` : '/api/admin/students';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            closeModal(studentFormModal);

            if (data.success) {
                showToast(isEdit ? (currentLang === 'ar' ? 'تم تحديث بيانات الطالب.' : 'Student updated successfully.') : (currentLang === 'ar' ? 'تمت إضافة الطالب بنجاح.' : 'Student added successfully.'), 'success');
                loadAdminStudents();
            } else {
                showToast(data.message || 'Unable to save student.', 'error');
            }
        } catch (err) {
            showToast('Server error while saving student.', 'error');
        }
    });

    document.getElementById('search-admin-students').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = cacheStudents.filter(s =>
            s.student_number.toLowerCase().includes(q) ||
            s.full_name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
        );
        renderAdminStudentsTable(filtered);
    });

    // 3. Admin Manage Courses
    async function loadAdminCourses() {
        try {
            const res = await apiFetch('/api/courses');
            const data = await res.json();

            if (data.success) {
                cacheCourses = data.courses;
                renderAdminCoursesTable(cacheCourses);
            }
        } catch (err) {
            console.error('Error loading admin courses:', err);
        }
    }

    function renderAdminCoursesTable(courses) {
        const tbody = document.getElementById('admin-courses-tbody');
        if (courses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                            <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد مواد أكاديمية' : 'No Academic Courses'}</div>
                            <div class="empty-state-text">${currentLang === 'ar' ? 'اضغط "إضافة مادة جديدة" لإنشاء مادة دراسية.' : 'Click "Add Course" to create a new course.'}</div>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = courses.map(c => `
            <tr>
                <td><strong>${c.course_code}</strong></td>
                <td>${c.course_name}</td>
                <td>${c.credit_hours} ${currentLang === 'ar' ? 'ساعات' : 'Hours'}</td>
                <td>${c.instructor}</td>
                <td>${c.available_seats} ${currentLang === 'ar' ? 'مقاعد' : 'Seats'}</td>
                <td>${getStatusBadge(c.status)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-course-btn" data-id="${c.id}"><i class="fa-solid fa-pen"></i> ${t('edit')}</button>
                    <button class="btn btn-danger btn-sm delete-course-btn" data-id="${c.id}"><i class="fa-solid fa-trash"></i> ${t('delete')}</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const course = cacheCourses.find(c => c.id == id);
                if (course) openCourseFormModal(course);
            });
        });

        tbody.querySelectorAll('.delete-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const course = cacheCourses.find(c => c.id == id);
                if (course) {
                    pendingDeleteAction = async () => {
                        try {
                            const res = await apiFetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (data.success) {
                                showToast(currentLang === 'ar' ? 'تم حذف المادة الأكاديمية بنجاح.' : 'Course deleted successfully.', 'success');
                                loadAdminCourses();
                            } else {
                                showToast(data.message || 'Unable to delete course.', 'error');
                            }
                        } catch (err) {
                            showToast('Server error while deleting course.', 'error');
                        }
                    };
                    document.getElementById('delete-modal-message').textContent = currentLang === 'ar'
                        ? `هل أنت تأكد من رغبتك في حذف المادة "${course.course_code} - ${course.course_name}"؟`
                        : `Are you sure you want to delete course "${course.course_code} - ${course.course_name}"?`;
                    openModal(confirmDeleteModal);
                }
            });
        });
    }

    document.getElementById('open-add-course-btn').addEventListener('click', () => {
        openCourseFormModal(null);
    });

    function openCourseFormModal(course) {
        const titleEl = document.getElementById('course-modal-title');
        if (course) {
            titleEl.textContent = currentLang === 'ar' ? 'تعديل مادة أكاديمية' : 'Edit Course';
            document.getElementById('course-form-id').value = course.id;
            document.getElementById('course-form-code').value = course.course_code;
            document.getElementById('course-form-name').value = course.course_name;
            document.getElementById('course-form-credits').value = course.credit_hours;
            document.getElementById('course-form-instructor').value = course.instructor;
            document.getElementById('course-form-seats').value = course.available_seats;
            document.getElementById('course-form-status').value = course.status;
        } else {
            titleEl.textContent = currentLang === 'ar' ? 'إضافة مادة جديدة' : 'Add New Course';
            document.getElementById('course-form').reset();
            document.getElementById('course-form-id').value = '';
        }
        openModal(courseFormModal);
    }

    document.getElementById('course-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('course-form-id').value;
        const payload = {
            courseCode: document.getElementById('course-form-code').value,
            courseName: document.getElementById('course-form-name').value,
            creditHours: document.getElementById('course-form-credits').value,
            instructor: document.getElementById('course-form-instructor').value,
            availableSeats: document.getElementById('course-form-seats').value,
            status: document.getElementById('course-form-status').value
        };

        const isEdit = Boolean(id);
        const url = isEdit ? `/api/admin/courses/${id}` : '/api/admin/courses';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            closeModal(courseFormModal);

            if (data.success) {
                showToast(isEdit ? (currentLang === 'ar' ? 'تم تحديث المادة بنجاح.' : 'Course updated successfully.') : (currentLang === 'ar' ? 'تمت إضافة المادة بنجاح.' : 'Course added successfully.'), 'success');
                loadAdminCourses();
            } else {
                showToast(data.message || 'Unable to save course.', 'error');
            }
        } catch (err) {
            showToast('Server error while saving course.', 'error');
        }
    });

    document.getElementById('search-admin-courses').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = cacheCourses.filter(c =>
            c.course_code.toLowerCase().includes(q) ||
            c.course_name.toLowerCase().includes(q) ||
            c.instructor.toLowerCase().includes(q)
        );
        renderAdminCoursesTable(filtered);
    });

    // 4. Admin Manage Requests Page
    async function loadAdminRequests() {
        try {
            const res = await apiFetch('/api/admin/requests');
            const data = await res.json();

            if (data.success) {
                const tbody = document.getElementById('admin-requests-tbody');
                if (data.requests.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i class="fa-solid fa-list-check"></i></div>
                                    <div class="empty-state-title">${currentLang === 'ar' ? 'لا توجد طلبات تسجيل' : 'No Registration Requests'}</div>
                                    <div class="empty-state-text">${currentLang === 'ar' ? 'لم يتم العثور على أي طلبات تسجيل طلاب.' : 'No student registration requests found.'}</div>
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                tbody.innerHTML = data.requests.map(r => {
                    const isPending = r.status === 'PENDING';
                    const actions = isPending ? `
                        <button class="btn btn-primary btn-sm approve-req-btn" data-id="${r.id}">${t('approve')}</button>
                        <button class="btn btn-danger btn-sm reject-req-btn" data-id="${r.id}">${t('reject')}</button>
                    ` : `<span style="font-size:12px; color:var(--text-secondary);">${getStatusBadge(r.status)}</span>`;

                    return `
                        <tr>
                            <td>#REQ-${String(r.id).padStart(4, '0')}</td>
                            <td><strong>${r.student_name}</strong><br><span style="font-size:12px;color:var(--text-secondary);">${r.student_number}</span></td>
                            <td><strong>${r.course_code}</strong> - ${r.course_name}</td>
                            <td>${formatDate(r.requested_at)}</td>
                            <td>${getStatusBadge(r.status)}</td>
                            <td>${actions}</td>
                        </tr>
                    `;
                }).join('');

                bindRequestActionButtons(tbody);
            }
        } catch (err) {
            console.error('Error loading admin requests:', err);
        }
    }

    function bindRequestActionButtons(container) {
        container.querySelectorAll('.approve-req-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                try {
                    const res = await apiFetch(`/api/admin/requests/${id}/approve`, { method: 'PATCH' });
                    const data = await res.json();
                    if (data.success) {
                        showToast(currentLang === 'ar' ? 'تمت الموافقة على طلب التسجيل.' : 'Registration request approved.', 'success');
                        if (currentView === 'admin-dashboard') loadAdminDashboard();
                        else loadAdminRequests();
                    } else {
                        showToast(data.message || 'Unable to approve request.', 'error');
                    }
                } catch (err) {
                    showToast('Server error while approving request.', 'error');
                }
            });
        });

        container.querySelectorAll('.reject-req-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                try {
                    const res = await apiFetch(`/api/admin/requests/${id}/reject`, { method: 'PATCH' });
                    const data = await res.json();
                    if (data.success) {
                        showToast(currentLang === 'ar' ? 'تم رفض طلب التسجيل.' : 'Registration request rejected.', 'success');
                        if (currentView === 'admin-dashboard') loadAdminDashboard();
                        else loadAdminRequests();
                    } else {
                        showToast(data.message || 'Unable to reject request.', 'error');
                    }
                } catch (err) {
                    showToast('Server error while rejecting request.', 'error');
                }
            });
        });
    }

    // Modal Helpers
    function openModal(modalEl) {
        modalEl.classList.add('active');
    }

    function closeModal(modalEl) {
        modalEl.classList.remove('active');
    }

    document.querySelectorAll('.closeModalBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        if (pendingDeleteAction) {
            pendingDeleteAction();
            pendingDeleteAction = null;
        }
        closeModal(confirmDeleteModal);
    });

    // Initialize Language & Session Check
    setLanguage(currentLang);
    checkSession();
});
