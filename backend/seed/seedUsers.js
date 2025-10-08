require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

// Sample users data
const usersData = [
  {
    username: "User Test",
    email: "user@gmail.com",
    password: "123", // Will be hashed by pre-save hook
    plainPassword: "123", // Plain password for admin view
    role: "user",
    address: "123 Test Street",
    dateOfBirth: "1990-01-01",
    profilePicture: ""
  },
  {
    username: "John Doe",
    email: "john@example.com",
    password: "123",
    plainPassword: "123",
    role: "user",
    address: "456 Main St",
    dateOfBirth: "1995-05-15",
    profilePicture: ""
  },
  {
    username: "Jane Smith",
    email: "jane@example.com",
    password: "123",
    plainPassword: "123",
    role: "user",
    address: "789 Oak Ave",
    dateOfBirth: "1992-08-20",
    profilePicture: ""
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");

    // Delete existing users (except admin)
    await User.deleteMany({ role: "user" });
    console.log("🗑️  Deleted old users");

    // Create sample users (use create to trigger pre-save hook for password hashing)
    for (const userData of usersData) {
      await User.create(userData);
      console.log(`✅ Created user: ${userData.email}`);
    }
    console.log("✅ Seeded users successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
