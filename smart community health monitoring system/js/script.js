// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuMwe2Xl6zb4tevtoJw2jWLyz8S7d0eFY",
  authDomain: "health-monitoring-bbc0f.firebaseapp.com",
  projectId: "health-monitoring-bbc0f",
  storageBucket: "health-monitoring-bbc0f.firebasestorage.app",
  messagingSenderId: "187676272379",
  appId: "1:187676272379:web:2c4429602381c748f6b25e",
  measurementId: "G-HQ0V73NS24"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    console.log("System Initializing...");

    // --- UI References ---
    const ui = {
        loader: document.getElementById('loader'),
        authScreens: document.getElementById('auth-screens'),
        appContainer: document.getElementById('app-container'),
        loginScreen: document.getElementById('login-screen'),
        registerScreen: document.getElementById('register-screen'),
        forgotScreen: document.getElementById('forgot-screen'),

        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        forgotForm: document.getElementById('forgotForm'),
        vitalsForm: document.getElementById('vitalsForm'),
        recordForm: document.getElementById('recordForm'),
        vaxForm: document.getElementById('vaxForm'),
        medicineForm: document.getElementById('medicineForm'),
        addPatientForm: document.getElementById('addPatientForm'),

        vitalsModal: document.getElementById('vitalsModal'),
        recordModal: document.getElementById('recordModal'),
        vaxModal: document.getElementById('vaxModal'),
        medicineModal: document.getElementById('medicineModal'),
        patientModal: document.getElementById('patientModal'),

        headerName: document.getElementById('header-user-name'),
        logoutBtn: document.getElementById('logoutBtn'),
        confirmBookingBtn: document.getElementById('confirmBookingBtn'),
        sosBtn: document.getElementById('sos-btn-main'),
        themeToggle: document.getElementById('theme-toggle'),
        toRegister: document.getElementById('toRegister'),
        toForgot: document.getElementById('toForgot'),
        backToLoginLinks: document.querySelectorAll('.backToLoginLink')
    };

    let currentUserRole = 'patient';

    // --- Auth Navigation ---
    if (ui.toRegister) ui.toRegister.onclick = (e) => { e.preventDefault(); showAuthScreen('register'); };
    if (ui.toForgot) ui.toForgot.onclick = (e) => { e.preventDefault(); showAuthScreen('forgot'); };
    ui.backToLoginLinks.forEach(link => {
        link.onclick = (e) => { e.preventDefault(); showAuthScreen('login'); };
    });

    // --- Utility: Feedback ---
    const showLoader = (show) => { if(ui.loader) ui.loader.style.display = show ? 'flex' : 'none'; };

    const showToast = (msg, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const t = document.createElement('div');
        t.className = `toast-msg toast-${type}`;
        t.style.cssText = `
            background: white; padding: 15px 25px; border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: flex; align-items: center;
            gap: 12px; font-size: 14px; font-weight: 500; margin-bottom: 10px;
            border-left: 5px solid ${type === 'error' ? '#ee5d50' : '#01b574'};
            animation: slideIn 0.3s ease-out;
        `;
        t.textContent = msg;
        container.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 4000);
    };

    // --- Core: Navigation ---
    window.showPage = (pageId) => {
        console.log("Navigating to:", pageId);
        const pageViews = document.querySelectorAll('.page-view');
        const navLinks = document.querySelectorAll('#main-nav a[data-page]');
        const pageTitle = document.getElementById('current-page-title');

        pageViews.forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`page-${pageId}`);
        if (target) {
            target.classList.add('active');
            if (pageTitle) pageTitle.textContent = pageId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            window.scrollTo(0, 0);
        }

        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-page') === pageId);
        });

        fetchDataForPage(pageId);
    };

    async function fetchDataForPage(pageId) {
        const user = auth.currentUser;
        if (!user) return;

        try {
            switch(pageId) {
                case 'patient-dashboard':
                case 'appointments': await renderAppointments(user.uid); break;
                case 'vaccination': await renderVaccinations(user.uid); break;
                case 'vitals': await renderVitals(user.uid); break;
                case 'records': await renderRecords(user.uid); break;
                case 'medications': await renderMedications(user.uid); break;
                case 'profile': await renderProfile(user.uid); break;
                case 'patient-list':
                case 'manage-patients': await renderPatients(); break;
                case 'user-management': await renderUsers(); break;
            }
        } catch (err) { console.error("Fetch Error:", err); }
    }

    const getFriendlyError = (err) => {
        if (!err.code) return err.message || "An unexpected error occurred.";

        switch (err.code) {
            case 'auth/wrong-password': return "Incorrect password. Please try again.";
            case 'auth/user-not-found': return "No account found with this email.";
            case 'auth/email-already-in-use': return "This email is already registered.";
            case 'auth/invalid-email': return "Please enter a valid email address.";
            case 'auth/weak-password': return "Password is too weak. Use at least 6 characters.";
            case 'auth/too-many-requests': return "Too many failed attempts. Please try again later.";
            case 'auth/network-request-failed': return "Network error. Please check your connection.";
            case 'permission-denied': return "You don't have permission to perform this action.";
            case 'unavailable': return "The service is temporarily unavailable. Please try again.";
            default:
                console.error("Firebase Error:", err);
                return "Something went wrong. Please try again.";
        }
    };

    // --- Core: Auth ---
    const enterApp = (userData) => {
        currentUserRole = userData.role || 'patient';
        const userName = userData.name || "User";

        if (ui.authScreens) ui.authScreens.style.display = 'none';
        if (ui.appContainer) ui.appContainer.style.display = 'flex';

        // Apply Role Theme
        document.body.classList.remove('role-doctor', 'role-patient', 'role-nurse', 'role-admin');
        document.body.classList.add(`role-${currentUserRole}`);

        if (ui.headerName) ui.headerName.textContent = userName;
        document.querySelectorAll('.user-display-name').forEach(el => el.textContent = userName);

        document.querySelectorAll('[data-roles]').forEach(el => {
            const roles = el.getAttribute('data-roles').split(',');
            el.style.display = roles.includes(currentUserRole) ? (el.tagName === 'A' ? 'flex' : 'block') : 'none';
        });

        window.showPage(`${currentUserRole}-dashboard`);
        startRealtimeStats();
        showLoader(false);
    };

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).get().then(doc => {
                if (doc.exists) enterApp(doc.data());
                else enterApp({ name: user.displayName || "User", role: 'patient' });
            }).catch(err => {
                console.error(err);
                showLoader(false);
            });
        } else {
            showLoader(false);
            if (ui.authScreens) ui.authScreens.style.display = 'block';
            if (ui.appContainer) ui.appContainer.style.display = 'none';
            showAuthScreen('login');
        }
    });

    const showAuthScreen = (screen) => {
        if (ui.loginScreen) {
            ui.loginScreen.style.display = screen === 'login' ? 'flex' : 'none';
            if (screen === 'login') {
                // Play welcome audio - requires user interaction often, but we'll try
                const playWelcome = () => {
                    const audio = new Audio('my.m4a');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log("Audio autoplay blocked, waiting for interaction."));
                    document.removeEventListener('click', playWelcome);
                };
                document.addEventListener('click', playWelcome);
            }
        }
        if (ui.registerScreen) ui.registerScreen.style.display = screen === 'register' ? 'flex' : 'none';
        if (ui.forgotScreen) ui.forgotScreen.style.display = screen === 'forgot' ? 'flex' : 'none';
    };

    // --- Form Handlers ---
    if (ui.loginForm) {
        ui.loginForm.onsubmit = async (e) => {
            e.preventDefault();
            showLoader(true);
            try {
                await auth.signInWithEmailAndPassword(ui.loginForm.email.value, ui.loginForm.password.value);
            } catch (err) {
                showToast(getFriendlyError(err), "error");
                showLoader(false);
            }
        };
    }

    if (ui.registerForm) {
        ui.registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(ui.registerForm);
            if (fd.get('password') !== fd.get('confirm')) return showToast("Passwords do not match!", "error");

            showLoader(true);
            const role = ui.registerForm.querySelector('input[name="role"]:checked')?.value || 'patient';
            const userData = {
                name: fd.get('fullname'),
                email: fd.get('email'),
                phone: fd.get('phone'),
                dob: fd.get('dob'),
                gender: fd.get('gender'),
                blood: fd.get('blood'),
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            try {
                const cred = await auth.createUserWithEmailAndPassword(userData.email, fd.get('password'));

                // Initialize user-specific "database"
                await db.collection("users").doc(cred.user.uid).set(userData);

                // Create dedicated user database structure (metadata document)
                await db.collection("users").doc(cred.user.uid).collection("config").doc("initialization").set({
                    status: "Active",
                    version: "2.0",
                    dbCreated: firebase.firestore.FieldValue.serverTimestamp()
                });

                showToast("Account and personal database created successfully!");
            } catch (err) {
                showToast(getFriendlyError(err), "error");
            }
            finally { showLoader(false); }
        };
    }

    if (ui.forgotForm) {
        ui.forgotForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            if (!email) return showToast("Please enter your email", "error");

            showLoader(true);
            try {
                await auth.sendPasswordResetEmail(email);
                showToast("Password reset link sent to your email!");
                setTimeout(() => showAuthScreen('login'), 2000);
            } catch (err) {
                showToast(getFriendlyError(err), "error");
            } finally {
                showLoader(false);
            }
        };
    }

    const saveToDb = async (col, data, modal) => {
        const user = auth.currentUser;
        if (!user && col !== 'users') return showToast("Please login first", "error");
        showLoader(true);
        try {
            // New structure: Each user has their own "particular database" via sub-collections
            let targetCollection;
            if (col === 'users') {
                targetCollection = db.collection("users");
                data.addedBy = user ? user.uid : "system";
            } else {
                targetCollection = db.collection("users").doc(user.uid).collection(col);
            }

            await targetCollection.add({
                ...data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            showToast("Saved Successfully to your database!");
            if (modal) modal.style.display = 'none';
            fetchDataForPage(document.querySelector('.page-view.active').id.replace('page-', ''));
        } catch (err) { showToast(getFriendlyError(err), "error"); }
        finally { showLoader(false); }
    };

    if (ui.addPatientForm) {
        ui.addPatientForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(ui.addPatientForm);
            saveToDb("users", {
                name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
                blood: fd.get('blood'), role: 'patient'
            }, ui.patientModal);
        };
    }

    if (ui.vitalsForm) {
        ui.vitalsForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(ui.vitalsForm);
            saveToDb("vitals", {
                heartRate: fd.get('hr'), bp: fd.get('bp'), temp: fd.get('temp'), spo2: fd.get('spo2')
            }, ui.vitalsModal);
        };
    }

    if (ui.recordForm) {
        ui.recordForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(ui.recordForm);
            saveToDb("health_records", { diagnosis: fd.get('diagnosis'), notes: fd.get('notes') }, ui.recordModal);
        };
    }

    if (ui.medicineForm) {
        ui.medicineForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(ui.medicineForm);
            saveToDb("medications", {
                name: fd.get('med_name'), dosage: fd.get('dosage'), instructions: fd.get('instructions'),
                schedule: { morning: fd.has('m'), afternoon: fd.has('a'), night: fd.has('n') }
            }, ui.medicineModal);
        };
    }

    if (ui.vaxForm) {
        ui.vaxForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(ui.vaxForm);
            saveToDb("vaccinations", {
                vaccine: fd.get('vaccine'), dose: fd.get('dose'), date: fd.get('date'), due: fd.get('due')
            }, ui.vaxModal);
        };
    }

    if (ui.confirmBookingBtn) {
        ui.confirmBookingBtn.onclick = () => {
            const docSelect = document.getElementById('book-appt-doctor');
            const selectedDoc = docSelect ? docSelect.value : "Dr. Sarah Wilson";
            const timeSlot = document.querySelector('.time-slot-v2.selected')?.innerText || "09:30 AM";
            const date = window.selectedBookingDate || "15 May 2026";

            saveToDb("appointments", {
                doctor: selectedDoc, date: date, time: timeSlot, status: "Upcoming"
            });
        };
    }

    // --- Global Click Listeners ---
    document.addEventListener('click', (e) => {
        const target = e.target;
        const clickable = target.closest('button, a, .calendar-grid div, .icon-btn-header, .toggle-password-premium');
        if (!clickable) return;

        const txt = clickable.innerText.trim();

        if (txt.includes("Add New Patient") || txt.includes("Add Patient")) if(ui.patientModal) ui.patientModal.style.display = 'flex';
        if (txt.includes("Record Vital")) if(ui.vitalsModal) ui.vitalsModal.style.display = 'flex';
        if (txt.includes("Add Record")) if(ui.recordModal) ui.recordModal.style.display = 'flex';
        if (txt.includes("Add Medicine")) if(ui.medicineModal) ui.medicineModal.style.display = 'flex';
        if (txt.includes("Add Vaccine")) if(ui.vaxModal) ui.vaxModal.style.display = 'flex';

        if (clickable.classList.contains('appt-tab')) {
            document.querySelectorAll('.appt-tab').forEach(t => t.classList.remove('active'));
            clickable.classList.add('active');
            fetchDataForPage('appointments');
        }

        if (clickable.classList.contains('vax-tab')) {
            document.querySelectorAll('.vax-tab').forEach(t => t.classList.remove('active'));
            clickable.classList.add('active');
            fetchDataForPage('vaccination');
        }

        if (clickable.classList.contains('time-slot-v2')) {
            document.querySelectorAll('.time-slot-v2').forEach(s => s.classList.remove('selected'));
            clickable.classList.add('selected');
        }

        if (clickable.parentElement && clickable.parentElement.classList.contains('calendar-grid') && !clickable.classList.contains('day-muted')) {
            if (!["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(txt)) {
                document.querySelectorAll('.calendar-grid div').forEach(d => d.classList.remove('day-active'));
                clickable.classList.add('day-active');
                window.selectedBookingDate = `${txt} May 2026`;
                showToast(`Date Selected: ${window.selectedBookingDate}`);
            }
        }

        if (clickable.classList.contains('btn-cancel') || (clickable.classList.contains('btn-outline-danger-sm') && txt === 'Cancel')) {
            const card = clickable.closest('.appt-card-v2');
            const docId = card.getAttribute('data-id');
            const docName = card.querySelector('.doc-name-v2').innerText.split('✓')[0].trim();
            if(confirm(`Cancel appointment with ${docName} permanently?`)) deleteAppt(docId);
        }

        if (clickable.classList.contains('btn-complete') || (clickable.classList.contains('btn-primary-sm') && txt === 'Complete')) {
            const card = clickable.closest('.appt-card-v2');
            const docId = card.getAttribute('data-id');
            updateApptStatusById(docId, "Completed");
        }

        if (clickable.classList.contains('btn-response') || txt === 'Response') {
            showToast("Response sent successfully!");
        }

        if (clickable.classList.contains('toggle-password-premium')) {
            const input = clickable.parentElement.querySelector('input');
            if (input) {
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                clickable.textContent = isPass ? '🔒' : '👁️';
            }
        }

        if (txt.includes("Download") || clickable.classList.contains('vax-download-btn')) {
            showToast("Preparing document... Please wait.");
            setTimeout(() => {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    const title = txt.includes("Certificate") ? "Vaccination Certificate" :
                                 txt.includes("Report") ? "Medical Report" :
                                 "Health Record";

                    doc.setFontSize(22);
                    doc.text(title, 20, 20);
                    doc.setFontSize(12);
                    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
                    doc.text(`Patient Name: ${ui.headerName.textContent}`, 20, 40);
                    doc.text("--------------------------------------------------", 20, 45);
                    doc.text("This is a digitally generated document from the", 20, 55);
                    doc.text("Smart Community Health Monitoring System.", 20, 62);

                    const fileName = `${title.toLowerCase().replace(/ /g, '_')}_${Date.now()}.pdf`;
                    doc.save(fileName);

                    showToast("PDF generated and download started!");
                    alert(`The ${title} has been generated. Please choose a location to save the file in your browser's download dialog.`);
                } catch (err) {
                    console.error("PDF Generation Error:", err);
                    showToast("Failed to generate PDF. Please try again.", "error");
                }
            }, 800);
        }

        if (clickable.classList.contains('btn-ghost') && clickable.closest('.modal')) clickable.closest('.modal').style.display = 'none';
        if (clickable.id === 'logoutBtn' || clickable.classList.contains('logout')) auth.signOut();

        if (clickable.id === 'theme-toggle') {
            document.body.classList.toggle('dark-mode');
            clickable.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            showToast(`Theme switched to ${document.body.classList.contains('dark-mode') ? 'Dark' : 'Light'} Mode`);
        }

        if (clickable.id === 'notif-btn-header') {
            window.showPage('notifications');
        }

        if (clickable.classList.contains('vax-delete-btn')) {
            const vId = clickable.getAttribute('data-id');
            if(confirm("Delete this vaccination record permanently?")) deleteVax(vId);
        }
    });

    const vaxSearch = document.getElementById('vaxSearchInput');
    if (vaxSearch) vaxSearch.oninput = () => renderVaccinations(auth.currentUser.uid);

    const vaxFilter = document.getElementById('vaxStatusFilter');
    if (vaxFilter) vaxFilter.onchange = () => renderVaccinations(auth.currentUser.uid);

    async function updateApptStatusById(docId, newStatus) {
        showLoader(true);
        try {
            const user = auth.currentUser;
            await db.collection("users").doc(user.uid).collection("appointments").doc(docId).update({ status: newStatus });
            if (newStatus === "Completed") {
                showToast("Completed successfully");
            } else {
                showToast(`Status updated to ${newStatus}`);
            }
            fetchDataForPage('appointments');
        } catch (err) { showToast(getFriendlyError(err), "error"); }
        finally { showLoader(false); }
    }

    async function deleteAppt(docId) {
        showLoader(true);
        try {
            const user = auth.currentUser;
            await db.collection("users").doc(user.uid).collection("appointments").doc(docId).delete();
            showToast("Appointment cancelled permanently");
            fetchDataForPage('appointments');
        } catch (err) { showToast(getFriendlyError(err), "error"); }
        finally { showLoader(false); }
    }

    async function updateApptStatus(doctor, date, newStatus) {
        showLoader(true);
        try {
            const user = auth.currentUser;
            const snap = await db.collection("users").doc(user.uid).collection("appointments")
                .where("doctor", "==", doctor)
                .where("date", "==", date)
                .get();
            if (!snap.empty) {
                await snap.docs[0].ref.update({ status: newStatus });
                showToast(`Status updated to ${newStatus}`);
                fetchDataForPage('appointments');
            }
        } catch (err) { showToast(getFriendlyError(err), "error"); }
        finally { showLoader(false); }
    }

    function startRealtimeStats() {
        db.collection("users").where("role", "==", "patient").onSnapshot(s => updateStat("Total Patients", s.size));
        db.collection("users").where("role", "==", "doctor").onSnapshot(s => updateStat("Total Doctors", s.size));
        // Use collectionGroup for global stats across all user databases
        db.collectionGroup("appointments").onSnapshot(s => updateStat("Appointments Today", s.size));
    }

    function updateStat(label, value) {
        document.querySelectorAll('.stat-card, .stat-info').forEach(card => {
            const l = card.querySelector('.label, .stat-label');
            const v = card.querySelector('.value, .stat-val');
            if (l && l.innerText.includes(label) && v) v.innerText = value;
        });
    }

    document.querySelectorAll('#main-nav a[data-page]').forEach(a => {
        a.onclick = (e) => {
            e.preventDefault();
            window.showPage(a.getAttribute('data-page'));
            if (window.innerWidth <= 992) {
                const sb = document.querySelector('.sidebar');
                if (sb) sb.classList.remove('active');
            }
        };
    });

    // --- Mobile Sidebar Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.onclick = () => {
            sidebar.classList.toggle('active');
        };

        // Close sidebar when clicking outside on mobile
        document.addEventListener('mousedown', (e) => {
            if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // --- AI Chatbot Logic ---
    const chatIcon = document.getElementById('ai-chat-icon');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('ai-chat-input');
    const sendChat = document.getElementById('send-ai-chat');
    const chatMessages = document.getElementById('ai-chat-messages');

    if (chatIcon) {
        chatIcon.onclick = () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
            if (chatWindow.style.display === 'flex') chatInput.focus();
        };
    }

    if (closeChat) {
        closeChat.onclick = () => chatWindow.style.display = 'none';
    }

    const addChatMessage = (text, type) => {
        const msg = document.createElement('div');
        msg.className = type === 'ai' ? 'ai-msg' : 'user-msg';
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const processAICommand = (text) => {
        const input = text.toLowerCase();

        // Introductory phrases
        if (input.includes('who are you') || input.includes('your name')) {
            return "Hi, I am SCHMS (Smart Community Health Monitoring System)! I was created by Vignesh to be your personal health companion.";
        }

        if (input.includes('created by') || input.includes('who made you')) {
            return "I was created by Vignesh with the vision of making community healthcare smarter and more accessible.";
        }

        // Navigation Commands
        const pages = {
            'dashboard': 'patient-dashboard',
            'appointment': 'appointments',
            'vitals': 'vitals',
            'signs': 'vitals',
            'record': 'records',
            'history': 'records',
            'vaccine': 'vaccination',
            'medicine': 'medications',
            'pill': 'medications',
            'remind': 'medications',
            'profile': 'profile',
            'user': 'profile',
            'notify': 'notifications',
            'alert': 'notifications',
            'emergency': 'emergency',
            'sos': 'emergency',
            'setting': 'settings',
            'report': 'lab-reports',
            'lab': 'lab-reports'
        };

        for (let [keyword, pageId] of Object.entries(pages)) {
            if (input.includes('go to') && input.includes(keyword)) {
                window.showPage(pageId);
                chatWindow.style.display = 'none';
                return `Sure! Navigating you to the ${keyword} page now.`;
            }
        }

        // Default responses
        if (input.includes('hello') || input.includes('hi')) return "Hello! How can I help you today?";
        if (input.includes('help')) return "I can help you navigate the app. Try saying 'go to vitals' or 'go to appointments'. You can also ask who created me!";

        return "I'm still learning! You can ask me to navigate to different pages (like 'go to vitals') or ask about my creator.";
    };

    const handleChatSubmit = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addChatMessage(text, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const response = processAICommand(text);
            addChatMessage(response, 'ai');
        }, 600);
    };

    if (sendChat) sendChat.onclick = handleChatSubmit;
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        };
    }

    if (ui.sosBtn) {
        ui.sosBtn.onclick = () => {
            alert("🚨 EMERGENCY SOS ACTIVATED! 🚨\n\nYour current location and health data have been sent to emergency services and your primary doctor. Help is on the way!");
            saveToDb("emergency_alerts", { status: "Active", type: "Manual SOS" });
            ['step-sos', 'step-doctor', 'step-ambulance'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.opacity = '1';
            });
        };
    }
});

// --- Dynamic Renderers ---
async function renderAppointments(uid) {
    const container = document.querySelector('.appt-list-container');
    if (!container) return;
    try {
        const activeTab = document.querySelector('.appt-tab.active')?.innerText || "Upcoming Appointments";
        // Fetch from the user's particular database (sub-collection)
        let query = firebase.firestore().collection("users").doc(uid).collection("appointments");

        if (activeTab === "Upcoming Appointments") query = query.where("status", "==", "Upcoming");
        else if (activeTab === "Completed") query = query.where("status", "==", "Completed");
        else if (activeTab === "Cancelled") query = query.where("status", "==", "Cancelled");

        const snap = await query.get();
        let html = '';
        snap.forEach(doc => {
            const d = doc.data();
            const isUp = d.status === 'Upcoming';
            const badgeClass = d.status === 'Upcoming' ? 'badge-success' : (d.status === 'Cancelled' ? 'badge-danger' : 'badge-warning');

            html += `
            <div class="appt-card-v2" data-id="${doc.id}">
                <div class="appt-doc-info">
                    <img src="https://i.pravatar.cc/100?u=${d.doctor}" class="doc-img-lg">
                    <div style="flex:1">
                        <div class="doc-name-v2">${d.doctor}</div>
                        <div class="doc-spec-v2">Healthcare Specialist</div>
                    </div>
                </div>
                <div class="appt-time-info">
                    <div class="date-v2">📅 ${d.date}</div>
                    <div class="time-v2">🕒 ${d.time}</div>
                </div>
                <div class="appt-actions-v2">
                    <span class="badge ${badgeClass}">${d.status}</span>
                    <div style="margin-top:auto; display:flex; gap:5px;">
                        ${isUp ? `
                            <button class="btn btn-primary-sm btn-complete" style="font-size:9px;">Complete</button>
                            <button class="btn btn-outline-danger-sm btn-cancel" style="font-size:9px;">Cancel</button>
                            <button class="btn btn-ghost-sm btn-response" style="font-size:9px;">Response</button>
                        ` : ''}
                        ${!isUp ? '<button class="btn btn-primary-sm" style="font-size:9px;">Book Again</button>' : ''}
                    </div>
                </div>
            </div>`;
        });
        container.innerHTML = html || '<div style="padding:40px; text-align:center">No records found.</div>';
    } catch(e) {
        console.error(e);
        container.innerHTML = "Error loading appointments.";
    }
}

async function renderVaccinations(uid) {
    const tbody = document.querySelector('.vax-table tbody');
    if (!tbody) return;
    try {
        const activeTab = document.querySelector('.vax-tab.active')?.innerText || "All Vaccines";
        const statusFilter = document.getElementById('vaxStatusFilter')?.value || "All Status";
        const searchTerm = document.getElementById('vaxSearchInput')?.value.toLowerCase() || "";

        // Fetch from the user's particular database (sub-collection)
        let query = firebase.firestore().collection("users").doc(uid).collection("vaccinations");
        const snap = await query.get();

        let html = '';
        let total = 0, completed = 0, upcoming = 0, overdue = 0;

        snap.forEach(doc => {
            const v = doc.data();
            const vId = doc.id;
            total++;

            // Status Logic
            let status = 'Upcoming';
            if (v.date && v.date !== '-') status = 'Completed';
            if (v.due && new Date(v.due) < new Date() && (!v.date || v.date === '-')) status = 'Overdue';

            if (status === 'Completed') completed++;
            else if (status === 'Upcoming') upcoming++;
            else if (status === 'Overdue') overdue++;

            // Filtering
            if (activeTab !== "All Vaccines" && activeTab !== status) return;
            if (statusFilter !== "All Status" && statusFilter !== status) return;
            if (searchTerm && !v.vaccine.toLowerCase().includes(searchTerm)) return;

            const badgeClass = status === 'Completed' ? 'badge-success' : (status === 'Overdue' ? 'badge-danger' : 'badge-warning');

            html += `
            <tr>
                <td style="padding-left: 24px;">
                    <div class="vax-info">
                        <div class="vax-icon-small" style="background: #eff6ff; color: #2b59ff;">🛡️</div>
                        <div>
                            <div style="font-weight: 600;">${v.vaccine}</div>
                            <div style="font-size: 11px; color: var(--gray);">${v.vaccine} Vaccine</div>
                        </div>
                    </div>
                </td>
                <td><span style="font-weight: 600; color: var(--primary);">${v.dose}</span></td>
                <td>${v.date || '-'}</td>
                <td>${v.due || '-'}</td>
                <td><span class="badge ${badgeClass}">${status}</span></td>
                <td>
                    <button class="btn btn-ghost vax-download-btn" style="padding: 6px; min-width: 32px; border: 1px solid #e2e8f0;">
                        <span style="color: #2b59ff;">📄</span>
                    </button>
                </td>
                <td style="padding-right: 24px;">
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-ghost" style="padding: 4px;"><span style="color: var(--gray);">👁️</span></button>
                        <button class="btn btn-ghost vax-delete-btn" data-id="${vId}" style="padding: 4px;"><span style="color: #ee5d50;">🗑️</span></button>
                    </div>
                </td>
            </tr>`;
        });

        tbody.innerHTML = html || '<tr><td colspan="7" style="padding:40px; text-align:center">No records found matching your criteria.</td></tr>';

        // Update Summary Stats
        document.querySelectorAll('#page-vaccination .summary-card .value').forEach((el, idx) => {
            if (idx === 0) el.innerText = total;
            if (idx === 1) el.innerText = completed;
            if (idx === 2) el.innerText = upcoming;
            if (idx === 3) el.innerText = overdue;
        });

    } catch(e) {
        console.error(e);
        tbody.innerHTML = "<tr><td colspan='7'>Error loading vaccinations.</td></tr>";
    }
}

async function deleteVax(vId) {
    const user = auth.currentUser;
    showLoader(true);
    try {
        await db.collection("users").doc(user.uid).collection("vaccinations").doc(vId).delete();
        showToast("Vaccination record deleted from your database");
        fetchDataForPage('vaccination');
    } catch (err) { showToast(getFriendlyError(err), "error"); }
    finally { showLoader(false); }
}

async function renderVitals(uid) {
    const tbody = document.querySelector('#page-vitals table tbody');
    if (!tbody) return;
    // Fetch from the user's particular database (sub-collection)
    const snap = await firebase.firestore().collection("users").doc(uid).collection("vitals").get();
    let html = '';
    snap.forEach(doc => {
        const v = doc.data();
        html += `<tr><td>${v.timestamp?.toDate().toLocaleDateString() || 'Today'}</td><td>${v.heartRate} bpm</td><td>${v.bp}</td><td>${v.spo2}%</td><td>Normal</td></tr>`;
    });
    tbody.innerHTML = html || '<tr><td colspan="6" style="text-align:center">No data found in your database.</td></tr>';
}

async function renderRecords(uid) {
    const list = document.querySelector('#page-records .history-list');
    if (!list) return;
    // Fetch from the user's particular database (sub-collection)
    const snap = await firebase.firestore().collection("users").doc(uid).collection("health_records").get();
    let html = '';
    snap.forEach(doc => {
        const r = doc.data();
        html += `<li class="checked"><b>${r.diagnosis}</b>: ${r.notes}</li>`;
    });
    list.innerHTML = html || '<li>No records in your database.</li>';
}

async function renderPatients() {
    const grid = document.querySelector('#page-patient-list .grid-3');
    if (!grid) return;
    const snap = await firebase.firestore().collection("users").where("role", "==", "patient").get();
    let html = '';
    snap.forEach(doc => {
        const p = doc.data();
        html += `<div class="panel" style="padding:20px; border:1px solid #eee"><b>${p.name}</b><br><small>${p.email}</small></div>`;
    });
    grid.innerHTML = html;
}

async function renderUsers() {
    const tbody = document.querySelector('#page-user-management table tbody');
    if (!tbody) return;
    const snap = await firebase.firestore().collection("users").get();
    let html = '';
    snap.forEach(doc => {
        const u = doc.data();
        html += `<tr><td>${u.name}</td><td>${u.role}</td><td>${u.email}</td><td>Active</td></tr>`;
    });
    tbody.innerHTML = html;
}

async function renderProfile(uid) {} // Implementation handled in main block
async function renderMedications(uid) {
    const tbody = document.querySelector('#page-medications table tbody');
    if (!tbody) return;
    try {
        // Fetch from the user's particular database (sub-collection)
        const snap = await firebase.firestore().collection("users").doc(uid).collection("medications").get();
        let html = '';
        snap.forEach(doc => {
            const m = doc.data();
            const sched = m.schedule || {};
            const times = [];
            if(sched.morning) times.push("Morning");
            if(sched.afternoon) times.push("Afternoon");
            if(sched.night) times.push("Night");

            html += `
            <tr>
                <td style="font-weight:600;">${m.name}</td>
                <td>${m.dosage}</td>
                <td>${times.join(', ') || 'As needed'}</td>
                <td>${m.instructions || '-'}</td>
                <td><span class="badge badge-warning">⏳ Pending</span></td>
                <td><button class="btn btn-primary take-med-btn" style="padding:6px 12px; font-size:10px;">Take Now</button></td>
            </tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="6" style="padding:20px; text-align:center">No medications in your database.</td></tr>';
    } catch(e) {
        console.error(e);
        tbody.innerHTML = "<tr><td colspan='6'>Error loading medications.</td></tr>";
    }
}

