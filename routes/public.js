// routes/public.js
// Public-facing routes — no login required.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/publicController');

router.get('/',        controller.home);
router.get('/notices', controller.notices);
router.get('/events',  controller.events);
router.get('/gallery', controller.gallery);
router.get('/contact', controller.contact);

module.exports = router;
