// models/Gallery.js — MongoDB schema + Cloudinary deletion
const mongoose   = require('mongoose');
const cloudinary = require('cloudinary').v2;

const gallerySchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Cloudinary public_id
  url:      { type: String, required: true }, // Full https Cloudinary URL
  caption:  { type: String, default: '' },
}, { timestamps: true });

const M = mongoose.model('Gallery', gallerySchema);

module.exports = {
  getAll:        async ()              => await M.find().sort({ createdAt: -1 }).lean(),
  getById:       async (id)            => await M.findById(id).lean(),
  create:        async (data)          => await M.create(data),
  updateCaption: async ({id, caption}) => await M.findByIdAndUpdate(id, { caption }),
  delete: async (id) => {
    const img = await M.findById(id);
    if (img) {
      await cloudinary.uploader.destroy(img.filename); // delete from cloud
      await M.findByIdAndDelete(id);                   // delete from DB
    }
  },
};
