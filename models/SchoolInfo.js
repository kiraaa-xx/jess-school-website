// models/SchoolInfo.js — One document storing all school settings
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  school_name:    { type: String, default: 'Jaycees Everest Secondary School' },
  school_short:   { type: String, default: 'JESS' },
  tagline:        { type: String, default: 'Knowledge Is Wisdom' },
  phone:          { type: String, default: '+977-91-123456' },
  email:          { type: String, default: 'info@jessdhangadhi.edu.np' },
  address:        { type: String, default: 'Baiyabehadi, Dhangadhi Sub-Metropolitan City, Ward No.2, Kailali, Sudurpashchim Province, Nepal' },
  facebook_url:   { type: String, default: 'https://www.facebook.com/jayceeseverest1' },
  maps_url:       { type: String, default: 'https://maps.app.goo.gl/Ar2UHzjRiNYzSpTu5' },
  maps_embed:     { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3527.2!2d80.5702!3d28.7024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQyJzA4LjYiTiA4MMKwMzQnMTIuNyJF!5e0!3m2!1sen!2snp!4v1700000000000' },
  founded_bs:     { type: String, default: '2039' },
  founded_ad:     { type: String, default: '1982' },
  students_count: { type: String, default: '1263' },
  principal_name: { type: String, default: 'Karunakar Pandey' },
  vice_principal: { type: String, default: 'Dipen Saud' },
  hero_title:     { type: String, default: 'Nurturing <span>Bright Futures</span><br>Since 1982' },
  about_text:     { type: String, default: 'Founded in 2039 B.S. (1982 A.D.) through the vision of Dhangadhi Jaycees (JCI), our school was established to bring quality English-medium education to students of far-western Nepal. Over four decades, we have grown into one of the most respected institutions in Sudurpashchim Province.' },
});

const M = mongoose.model('SchoolInfo', schema);

module.exports = {
  // Get the one-and-only school info document
  getAll: async () => {
    let doc = await M.findOne().lean();
    if (!doc) { doc = await M.create({}); return doc.toObject ? doc.toObject() : doc; }
    return doc;
  },
  // Update multiple fields at once
  setMany: async (updates) => {
    let doc = await M.findOne();
    if (!doc) doc = new M({});
    Object.assign(doc, updates);
    await doc.save();
  },
};
