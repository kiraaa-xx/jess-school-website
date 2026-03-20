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

// ── Start Server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ JESS website running at http://localhost:${PORT}`);
  console.log(`   Admin panel:  http://localhost:${PORT}/admin\n`);
});
