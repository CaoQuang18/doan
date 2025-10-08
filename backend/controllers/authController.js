const User = require("../models/User");

// Register
exports.register = async (req, res) => {
  try {
    console.log('📝 Register request received:', { username: req.body.username, email: req.body.email });
    
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('❌ Missing fields');
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      return res.status(400).json({ message: "Email hoặc username đã tồn tại" });
    }

    // Create user (password stored as plain text - hashing disabled)
    // Role can be specified, defaults to "user" if not provided
    console.log('💾 Creating new user in MongoDB Cloud...');
    const user = await User.create({
      username,
      email,
      password, // Plain text password
      role: role || "user" // Allow role to be specified, default to "user"
    });

    console.log('✅ User created successfully in MongoDB Cloud!');
    console.log('   - ID:', user._id);
    console.log('   - Username:', user.username);
    console.log('   - Email:', user.email);
    console.log('   - Password (plain text):', password);
    console.log('   - Collection: user');

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email, password: '***' });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng điền email và mật khẩu" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    console.log('✅ User found:', user.email);
    console.log('🔑 Stored password hash:', user.password.substring(0, 20) + '...');

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('🔍 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Return user info (no JWT for now)
    res.json({
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || ''
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Admin login (separate endpoint for admin)
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng điền username và mật khẩu" });
    }

    // Find admin user
    const user = await User.findOne({ username, role: "admin" });
    if (!user) {
      return res.status(401).json({ message: "Tài khoản admin không tồn tại" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    res.json({
      message: "Đăng nhập admin thành công",
      isAdmin: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
