const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  house: { type: mongoose.Schema.Types.ObjectId, ref: "House" },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);