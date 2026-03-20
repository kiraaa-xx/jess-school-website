// controllers/publicController.js — Public pages (no login needed)
const Notice     = require('../models/Notice');
const Event      = require('../models/Event');
const Gallery    = require('../models/Gallery');
const SchoolInfo = require('../models/SchoolInfo');

module.exports = {
  async home(req, res) {
    const info    = await SchoolInfo.getAll();
    const notices = (await Notice.getAll()).slice(0, 6);
    const events  = (await Event.getAll()).slice(0, 4);
    const gallery = (await Gallery.getAll()).slice(0, 5);
    res.render('public/home', { info, notices, events, gallery });
  },
  async notices(req, res) {
    const info    = await SchoolInfo.getAll();
    const notices = await Notice.getAll();
    res.render('public/notices', { info, notices });
  },
  async events(req, res) {
    const info   = await SchoolInfo.getAll();
    const events = await Event.getAll();
    res.render('public/events', { info, events });
  },
  async gallery(req, res) {
    const info    = await SchoolInfo.getAll();
    const gallery = await Gallery.getAll();
    res.render('public/gallery', { info, gallery });
  },
  async contact(req, res) {
    const info = await SchoolInfo.getAll();
    res.render('public/contact', { info });
  },
};
