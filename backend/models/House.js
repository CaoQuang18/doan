const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  type: { type: String, required: true }, // House, Apartament
  name: { type: String, required: true },
  description: String,
  image: String,
  imageLg: String,
  country: String,
  address: String,
  bedrooms: String,
  bathrooms: String,
  surface: String,
  year: String,
  price: { type: Number, required: true },
  status: { type: String, enum: ["Đang thuê", "Trả phòng"], default: "Trả phòng" },
  agent: {
    image: String,
    name: String,
    phone: String
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("House", houseSchema);
