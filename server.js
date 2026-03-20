// server.js — Main entry point
require('dotenv').config(); // Load .env variables first

const express      = require('express');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const cloudinary   = require('cloudinary').v2;
const path         = require('path');
const connectDB    = require('./models/db');

const app = express();

// ── Connect to MongoDB Atlas ──
connectDB();

// ── Configure Cloudinary ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Template Engine ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Body Parsers ──
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── Sessions (stored in MongoDB so they survive restarts) ──
app.use(session({
  secret:            process.env.SESSION_SECRET || 'fallback-secret',
  resave:            false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // sessions last 24 hours
  }),
  cookie: {
    maxAge:   24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
  },
}));

// ── Routes ──
app.use('/',      require('./routes/public'));
app.use('/admin', require('./routes/admin'));

// ── 404 Page ──
app.use((req, res) => {
  res.status(404).render('public/404', {
    info: { school_name: 'Jaycees Everest Secondary School' }
  });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).send('<h2>Something went wrong.</h2><p>' + err.message + '</p><a href="/">Go Home</a>');
});

// ── Auto-setup: create admin and default data if not exists ──
async function autoSetup() {
  const Admin      = require('./models/Admin');
  const SchoolInfo = require('./models/SchoolInfo');
  const Notice     = require('./models/Notice');
  const Event      = require('./models/Event');

  await SchoolInfo.getAll(); // creates default info if not exists

  if (!(await Admin.exists())) {
    const pass = process.env.ADMIN_PASSWORD || 'admin123';
    await Admin.create('admin', pass);
    console.log('✅ Admin created → username: admin  password:', pass);
  }

  const mongoose = require('mongoose');
  if ((await mongoose.model('Notice').countDocuments()) === 0) {
    await Notice.create({ title: 'Admission Open for 2081 B.S.', body: 'Admissions are now open for all grades from ECD to Grade 12.', category: 'Admissions' });
    await Notice.create({ title: 'Grade 10 Board Exam Schedule', body: 'The SEE board examination schedule has been published by NEB.', category: 'Exams' });
    console.log('✅ Sample notices created.');
  }

  if ((await mongoose.model('Event').countDocuments()) === 0) {
    await Event.create({ title: 'Annual Sports Day', description: 'Inter-house sports competition.', event_date: '2025-03-28', location: 'JESS Playground' });
    console.log('✅ Sample events created.');
  }
}

// ── Start Server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\n✅ JESS website running at http://localhost:${PORT}`);
  console.log(`   Admin panel:  http://localhost:${PORT}/admin\n`);
  await autoSetup();
});