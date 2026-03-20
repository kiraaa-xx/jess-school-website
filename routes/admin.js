// routes/admin.js
// Admin panel routes — most require the requireLogin middleware.

const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/adminController');
const { requireLogin } = require('../middleware/auth');
const upload         = require('../middleware/upload');

// ── Auth ──────────────────────────────────────
router.get( '/login',  ctrl.showLogin);
router.post('/login',  ctrl.handleLogin);
router.get( '/logout', ctrl.handleLogout);

// All routes BELOW this line require login
router.use(requireLogin);

// ── Dashboard ────────────────────────────────
router.get('/', ctrl.dashboard);

// ── Notices ──────────────────────────────────
router.get( '/notices',          ctrl.listNotices);
router.get( '/notices/add',      ctrl.showAddNotice);
router.post('/notices/add',      ctrl.addNotice);
router.get( '/notices/edit/:id', ctrl.showEditNotice);
router.post('/notices/edit/:id', ctrl.editNotice);
router.post('/notices/delete/:id', ctrl.deleteNotice);

// ── Events ───────────────────────────────────
router.get( '/events',          ctrl.listEvents);
router.get( '/events/add',      ctrl.showAddEvent);
router.post('/events/add',      ctrl.addEvent);
router.get( '/events/edit/:id', ctrl.showEditEvent);
router.post('/events/edit/:id', ctrl.editEvent);
router.post('/events/delete/:id', ctrl.deleteEvent);

// ── Gallery ──────────────────────────────────
router.get( '/gallery',                   ctrl.listGallery);
// upload.single('image') runs multer before our controller
router.post('/gallery/upload',            upload.single('image'), ctrl.addGalleryImage);
router.post('/gallery/caption/:id',       ctrl.updateCaption);
router.post('/gallery/delete/:id',        ctrl.deleteGalleryImage);

// ── Settings ─────────────────────────────────
router.get( '/settings', ctrl.showSettings);
router.post('/settings', ctrl.saveSettings);

// ── Change Password ──────────────────────────
router.get( '/change-password', ctrl.showChangePassword);
router.post('/change-password', ctrl.changePassword);

module.exports = router;
