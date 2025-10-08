const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'username email' },
          { path: 'house', select: 'name price' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, cardLast4 } = req.body;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create payment
    const payment = new Payment({
      booking: bookingId,
      amount,
      paymentMethod,
      cardLast4,
      status: 'completed', // In production, this would be 'pending' until payment gateway confirms
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });

    await payment.save();

    // Update booking status to confirmed
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Populate before sending response
    await payment.populate({
      path: 'booking',
      populate: [
        { path: 'user', select: 'username email' },
        { path: 'house', select: 'name price' }
      ]
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'username email' },
          { path: 'house', select: 'name price' }
        ]
      });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update payment status (for admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    // Update booking status accordingly
    if (status === 'completed') {
      await Booking.findByIdAndUpdate(payment.booking, {
        status: 'confirmed',
        paymentStatus: 'paid'
      });
    }

    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
