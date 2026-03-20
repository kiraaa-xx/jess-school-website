// models/Notice.js — MongoDB schema + queries for notices
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:    { type: String, required: true, maxlength: 200 },
  body:     { type: String, required: true, maxlength: 2000 },
  category: { type: String, default: 'General' },
}, { timestamps: true });

const M = mongoose.model('Notice', noticeSchema);

module.exports = {
  getAll:   async ()           => await M.find().sort({ createdAt: -1 }).lean(),
  getById:  async (id)         => await M.findById(id).lean(),
  create:   async (data)       => await M.create(data),
  update:   async ({id,...d})  => await M.findByIdAndUpdate(id, d),
  delete:   async (id)         => await M.findByIdAndDelete(id),
};
