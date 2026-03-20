// models/Admin.js — Admin login credentials stored in MongoDB
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const M = mongoose.model('Admin', adminSchema);

module.exports = {
  findByUsername: async (username) => await M.findOne({ username }).lean(),
  exists:         async ()         => (await M.countDocuments()) > 0,
  create: async (username, plainPassword) => {
    const hash = await bcrypt.hash(plainPassword, 10);
    return await M.create({ username, password: hash });
  },
  updatePassword: async (username, newPlainPassword) => {
    const hash = await bcrypt.hash(newPlainPassword, 10);
    return await M.updateOne({ username }, { password: hash });
  },
};
