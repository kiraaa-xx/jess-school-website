// database/setup.js — Run ONCE: node database/setup.js
// Seeds default data into MongoDB Atlas.
require('dotenv').config();
const mongoose   = require('mongoose');
const SchoolInfo = require('../models/SchoolInfo');
const Admin      = require('../models/Admin');
const Notice     = require('../models/Notice');
const Event      = require('../models/Event');

async function setup() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected!\n');

  // School info (creates defaults automatically)
  await SchoolInfo.getAll();
  console.log('✅ School info ready.');

  // Admin account
  if (!(await Admin.exists())) {
    const pass = process.env.ADMIN_PASSWORD || 'admin123';
    await Admin.create('admin', pass);
    console.log('✅ Admin created → username: admin  password:', pass);
    console.log('⚠️  Please change this password after first login!\n');
  } else {
    console.log('ℹ️  Admin already exists, skipping.');
  }

  // Sample notices
  const { default: NoticeModel } = { default: mongoose.model('Notice') };
  if ((await mongoose.model('Notice').countDocuments()) === 0) {
    await Notice.create({ title: 'Admission Open for 2081 B.S.', body: 'Admissions are now open for all grades from ECD to Grade 12. Please visit the school office with required documents. Contact us for scholarship information.', category: 'Admissions' });
    await Notice.create({ title: 'Grade 10 Board Exam Schedule', body: 'The SEE board examination schedule has been published by the National Examination Board. Students are advised to check the timetable on the NEB website.', category: 'Exams' });
    await Notice.create({ title: 'Annual Sports Day – Postponed', body: 'The Annual Sports Day originally scheduled for Falgun 5 has been postponed to Falgun 15 due to weather. All parents and guardians are cordially invited.', category: 'Events' });
    console.log('✅ Sample notices inserted.');
  }

  // Sample events
  if ((await mongoose.model('Event').countDocuments()) === 0) {
    await Event.create({ title: 'Annual Sports Day',        description: 'Inter-house sports competition for all students.',          event_date: '2025-03-28', location: 'JESS Playground' });
    await Event.create({ title: 'Annual Cultural Function', description: 'Cultural performances, awards and prize distribution.',      event_date: '2025-04-15', location: 'JESS Auditorium' });
    await Event.create({ title: 'Parent-Teacher Meeting',   description: 'Mid-term progress review meeting for parents of all grades.', event_date: '2025-02-22', location: 'Respective Classrooms' });
    console.log('✅ Sample events inserted.');
  }

  console.log('\n🎉 Setup complete! You can now run: npm start');
  await mongoose.disconnect();
}

setup().catch(err => { console.error('❌ Setup failed:', err.message); process.exit(1); });
