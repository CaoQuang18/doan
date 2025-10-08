require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Check if admin exists
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "123", // Will be hashed by pre-save hook
      role: "admin"
    });

    console.log("✅ Admin user created successfully");
    console.log("   Username: admin");
    console.log("   Password: 123");
    console.log("   Email: admin@example.com");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
