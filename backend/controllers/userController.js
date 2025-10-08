const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Admin can see passwords, regular users cannot
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, address, dateOfBirth, profilePicture } = req.body;
    
    console.log('📝 Updating user in MongoDB Cloud:', req.params.id);
    console.log('   - New role:', role);
    console.log('🖼️  Profile picture:', profilePicture ? 'Updated' : 'No change');
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, address, dateOfBirth, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    console.log('✅ User updated successfully in MongoDB Cloud!');
    console.log('   - Username:', user.username);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);

    res.json({ message: "Cập nhật thành công", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Will trigger pre-save hook to hash

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    console.log('🗑️  Deleting user from MongoDB Cloud:', req.params.id);
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    
    console.log('✅ User deleted successfully from MongoDB Cloud!');
    console.log('   - Deleted user:', user.username, '(' + user.email + ')');
    console.log('   - Role:', user.role);
    
    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
