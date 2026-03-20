// models/Event.js — MongoDB schema + queries for events
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 2000 },
  event_date:  { type: String, required: true },
  location:    { type: String, default: 'JESS Campus', maxlength: 200 },
}, { timestamps: true });

const M = mongoose.model('Event', eventSchema);

module.exports = {
  getAll:  async ()          => await M.find().sort({ event_date: 1 }).lean(),
  getById: async (id)        => await M.findById(id).lean(),
  create:  async (data)      => await M.create(data),
  update:  async ({id,...d}) => await M.findByIdAndUpdate(id, d),
  delete:  async (id)        => await M.findByIdAndDelete(id),
};
