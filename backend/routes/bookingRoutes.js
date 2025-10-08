const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// CHECK availability
router.get("/check-availability", bookingController.checkAvailability);

// GET all bookings
router.get("/", bookingController.getAllBookings);

// GET booking by ID
router.get("/:id", bookingController.getBookingById);

// CREATE booking
router.post("/", bookingController.createBooking);

// UPDATE booking
router.put("/:id", bookingController.updateBooking);

// DELETE booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;