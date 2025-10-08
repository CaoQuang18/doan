const Booking = require("../models/Booking");

// Check house availability for a date range
exports.checkAvailability = async (req, res) => {
  try {
    const { houseId, startDate, endDate } = req.query;

    if (!houseId || !startDate || !endDate) {
      return res.status(400).json({ message: "Thiếu thông tin kiểm tra" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Tìm các booking trùng lịch
    const conflictingBookings = await Booking.find({
      house: houseId,
      status: { $in: ["confirmed"] }, // Chỉ kiểm tra confirmed
      $or: [
        { startDate: { $lte: start }, endDate: { $gt: start } },
        { startDate: { $lt: end }, endDate: { $gte: end } },
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    });

    const isAvailable = conflictingBookings.length === 0;

    res.json({ 
      available: isAvailable,
      message: isAvailable ? "Nhà còn trống" : "Nhà đã có người đặt trong thời gian này",
      conflicts: conflictingBookings.length
    });
  } catch (error) {
    console.error("Check availability error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email")
      .populate("house", "name type price address")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "username email")
      .populate("house", "name type price address");
    
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Create booking with automatic approval and conflict checking
exports.createBooking = async (req, res) => {
  try {
    const { user, house, startDate, endDate } = req.body;

    if (!user || !house || !startDate || !endDate) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Kiểm tra ngày hợp lệ
    if (start >= end) {
      return res.status(400).json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
    }

    // Kiểm tra xem có booking nào trùng lịch không
    const conflictingBookings = await Booking.find({
      house: house,
      status: { $in: ["confirmed", "pending"] }, // Kiểm tra cả pending và confirmed
      $or: [
        // Booking mới bắt đầu trong khoảng booking cũ
        { startDate: { $lte: start }, endDate: { $gt: start } },
        // Booking mới kết thúc trong khoảng booking cũ
        { startDate: { $lt: end }, endDate: { $gte: end } },
        // Booking mới bao trùm booking cũ
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    }).populate("user", "username email");

    // Nếu có booking trùng lịch
    if (conflictingBookings.length > 0) {
      const conflictInfo = conflictingBookings.map(b => ({
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        user: b.user?.username || "Unknown"
      }));

      return res.status(409).json({ 
        message: "Nhà này đã có người đặt trong khoảng thời gian bạn chọn. Vui lòng chọn ngày khác.",
        conflicts: conflictInfo
      });
    }

    // Tự động duyệt nếu không có xung đột
    const booking = await Booking.create({
      user,
      house,
      startDate: start,
      endDate: end,
      status: "confirmed" // Tự động duyệt
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "username email")
      .populate("house", "name type price address");

    res.status(201).json({ 
      message: "Đặt phòng thành công! Booking của bạn đã được tự động xác nhận.", 
      booking: populatedBooking 
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("user", "username email")
      .populate("house", "name type price address");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    res.json({ message: "Cập nhật booking thành công", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.json({ message: "Xóa booking thành công" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
