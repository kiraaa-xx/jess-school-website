// controllers/adminController.js — All admin panel actions
const bcrypt     = require('bcrypt');
const mongoose   = require('mongoose');
const Admin      = require('../models/Admin');
const Notice     = require('../models/Notice');
const Event      = require('../models/Event');
const Gallery    = require('../models/Gallery');
const SchoolInfo = require('../models/SchoolInfo');

// ── AUTH ──
function showLogin(req, res) {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
}
async function handleLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.render('admin/login', { error: 'Please enter username and password.' });
  const admin = await Admin.findByUsername(username.trim());
  if (!admin) return res.render('admin/login', { error: 'Invalid username or password.' });
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.render('admin/login', { error: 'Invalid username or password.' });
  req.session.isAdmin = true;
  req.session.adminName = admin.username;
  res.redirect('/admin');
}
function handleLogout(req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
}

// ── DASHBOARD ──
async function dashboard(req, res) {
  const noticeCount  = await mongoose.model('Notice').countDocuments();
  const eventCount   = await mongoose.model('Event').countDocuments();
  const galleryCount = await mongoose.model('Gallery').countDocuments();
  const info         = await SchoolInfo.getAll();
  res.render('admin/dashboard', { admin: req.session.adminName, noticeCount, eventCount, galleryCount, info });
}

// ── NOTICES ──
async function listNotices(req, res) {
  res.render('admin/notices', { notices: await Notice.getAll(), success: req.query.success });
}
function showAddNotice(req, res) {
  res.render('admin/notice-form', { notice: null, error: null });
}
async function addNotice(req, res) {
  const { title, body, category } = req.body;
  if (!title || !body) return res.render('admin/notice-form', { notice: null, error: 'Title and body are required.' });
  await Notice.create({ title: title.trim(), body: body.trim(), category: (category||'General').trim() });
  res.redirect('/admin/notices?success=Notice added successfully.');
}
async function showEditNotice(req, res) {
  const notice = await Notice.getById(req.params.id);
  if (!notice) return res.redirect('/admin/notices');
  res.render('admin/notice-form', { notice, error: null });
}
async function editNotice(req, res) {
  const { title, body, category } = req.body;
  if (!title || !body) {
    const notice = await Notice.getById(req.params.id);
    return res.render('admin/notice-form', { notice, error: 'Title and body are required.' });
  }
  await Notice.update({ id: req.params.id, title: title.trim(), body: body.trim(), category: (category||'General').trim() });
  res.redirect('/admin/notices?success=Notice updated successfully.');
}
async function deleteNotice(req, res) {
  await Notice.delete(req.params.id);
  res.redirect('/admin/notices?success=Notice deleted.');
}

// ── EVENTS ──
async function listEvents(req, res) {
  res.render('admin/events', { events: await Event.getAll(), success: req.query.success });
}
function showAddEvent(req, res) {
  res.render('admin/event-form', { event: null, error: null });
}
async function addEvent(req, res) {
  const { title, description, event_date, location } = req.body;
  if (!title || !event_date) return res.render('admin/event-form', { event: null, error: 'Title and date are required.' });
  await Event.create({ title: title.trim(), description: (description||'').trim(), event_date, location: (location||'JESS Campus').trim() });
  res.redirect('/admin/events?success=Event added successfully.');
}
async function showEditEvent(req, res) {
  const event = await Event.getById(req.params.id);
  if (!event) return res.redirect('/admin/events');
  res.render('admin/event-form', { event, error: null });
}
async function editEvent(req, res) {
  const { title, description, event_date, location } = req.body;
  if (!title || !event_date) {
    const event = await Event.getById(req.params.id);
    return res.render('admin/event-form', { event, error: 'Title and date are required.' });
  }
  await Event.update({ id: req.params.id, title: title.trim(), description: (description||'').trim(), event_date, location: (location||'JESS Campus').trim() });
  res.redirect('/admin/events?success=Event updated successfully.');
}
async function deleteEvent(req, res) {
  await Event.delete(req.params.id);
  res.redirect('/admin/events?success=Event deleted.');
}

// ── GALLERY ──
async function listGallery(req, res) {
  res.render('admin/gallery', { gallery: await Gallery.getAll(), success: req.query.success, error: req.query.error });
}
async function addGalleryImage(req, res) {
  if (!req.file) return res.redirect('/admin/gallery?error=Please select an image to upload.');
  await Gallery.create({ filename: req.file.filename, url: req.file.path, caption: (req.body.caption||'').trim() });
  res.redirect('/admin/gallery?success=Image uploaded successfully.');
}
async function updateCaption(req, res) {
  await Gallery.updateCaption({ id: req.params.id, caption: (req.body.caption||'').trim() });
  res.redirect('/admin/gallery?success=Caption updated.');
}
async function deleteGalleryImage(req, res) {
  await Gallery.delete(req.params.id);
  res.redirect('/admin/gallery?success=Image deleted.');
}

// ── SETTINGS ──
async function showSettings(req, res) {
  res.render('admin/settings', { info: await SchoolInfo.getAll(), success: req.query.success });
}
async function saveSettings(req, res) {
  const allowed = ['school_name','school_short','tagline','phone','email','address','facebook_url','maps_url','maps_embed','founded_bs','founded_ad','students_count','principal_name','vice_principal','hero_title','about_text'];
  const updates = {};
  for (const key of allowed) { if (req.body[key] !== undefined) updates[key] = req.body[key].trim(); }
  await SchoolInfo.setMany(updates);
  res.redirect('/admin/settings?success=Settings saved successfully.');
}

// ── CHANGE PASSWORD ──
function showChangePassword(req, res) {
  res.render('admin/change-password', { error: null, success: null });
}
async function changePassword(req, res) {
  const { current_password, new_password, confirm_password } = req.body;
  if (new_password !== confirm_password)
    return res.render('admin/change-password', { error: 'New passwords do not match.', success: null });
  if (new_password.length < 6)
    return res.render('admin/change-password', { error: 'Password must be at least 6 characters.', success: null });
  const admin = await Admin.findByUsername(req.session.adminName);
  const match = await bcrypt.compare(current_password, admin.password);
  if (!match)
    return res.render('admin/change-password', { error: 'Current password is incorrect.', success: null });
  await Admin.updatePassword(req.session.adminName, new_password);
  res.render('admin/change-password', { error: null, success: 'Password changed successfully!' });
}

module.exports = {
  showLogin, handleLogin, handleLogout, dashboard,
  listNotices, showAddNotice, addNotice, showEditNotice, editNotice, deleteNotice,
  listEvents, showAddEvent, addEvent, showEditEvent, editEvent, deleteEvent,
  listGallery, addGalleryImage, updateCaption, deleteGalleryImage,
  showSettings, saveSettings, showChangePassword, changePassword,
};
