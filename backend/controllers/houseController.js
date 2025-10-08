const House = require("../models/House");

// Get all houses
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find().sort({ createdAt: -1 });
    res.json(houses);
  } catch (error) {
    console.error("Get houses error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Get house by ID
exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "Không tìm thấy nhà" });
    }
    res.json(house);
  } catch (error) {
    console.error("Get house error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Create house
exports.createHouse = async (req, res) => {
  try {
    const houseData = req.body;
    
    // Validate required fields
    if (!houseData.name || !houseData.type || !houseData.price) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" });
    }

    const house = await House.create(houseData);
    res.status(201).json({ message: "Tạo nhà thành công", house });
  } catch (error) {
    console.error("Create house error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Update house
exports.updateHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!house) {
      return res.status(404).json({ message: "Không tìm thấy nhà" });
    }

    res.json({ message: "Cập nhật thành công", house });
  } catch (error) {
    console.error("Update house error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Delete house
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "Không tìm thấy nhà" });
    }
    res.json({ message: "Xóa nhà thành công" });
  } catch (error) {
    console.error("Delete house error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Delete multiple houses
exports.deleteMultipleHouses = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Vui lòng cung cấp danh sách IDs" });
    }

    const result = await House.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Đã xóa ${result.deletedCount} nhà`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Delete multiple houses error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Bulk upload houses
exports.bulkUploadHouses = async (req, res) => {
  try {
    const { houses } = req.body;
    
    if (!houses || !Array.isArray(houses)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Validate each house
    const validHouses = [];
    const errors = [];

    houses.forEach((house, index) => {
      if (!house.name || !house.type || !house.price) {
        errors.push(`Row ${index + 1}: Missing required fields`);
      } else {
        validHouses.push({
          ...house,
          price: Number(house.price),
          status: house.status || 'Trả phòng'
        });
      }
    });

    if (validHouses.length === 0) {
      return res.status(400).json({ 
        message: "No valid houses to upload",
        errors 
      });
    }

    // Insert all valid houses
    const result = await House.insertMany(validHouses);

    res.status(201).json({
      message: `Successfully uploaded ${result.length} houses`,
      created: result.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
