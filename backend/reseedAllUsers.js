require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

/**
 * Complete reseed of all users with proper password hashing
 * This will delete ALL users and recreate them
 */

const allUsersData = [
  // Admin
  {
    username: "admin",
    email: "admin@example.com",
    password: "123",
    plainPassword: "123",
    role: "admin"
  },
  // Regular users
  {
    username: "User Test",
    email: "user@gmail.com",
    password: "123",
    plainPassword: "123",
    role: "user",
    address: "123 Test Street",
    dateOfBirth: "1990-01-01"
  },
  {
    username: "John Doe",
    email: "john@example.com",
    password: "123",
    plainPassword: "123",
    role: "user",
    address: "456 Main St",
    dateOfBirth: "1995-05-15"
  },
  {
    username: "Jane Smith",
    email: "jane@example.com",
    password: "123",
    plainPassword: "123",
    role: "user",
    address: "789 Oak Ave",
    dateOfBirth: "1992-08-20"
  }
];

const reseedAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Delete ALL existing users
    const deleteResult = await User.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing users`);

    // Create all users using .create() to trigger pre-save hook
    console.log("\n📝 Creating users...");
    
    for (const userData of allUsersData) {
      const user = await User.create(userData);
      console.log(`✅ Created: ${user.email} (${user.role})`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Hashed: ${user.password.substring(0, 30)}...`);
    }

    console.log("\n✅ All users created successfully!");
    console.log("\n📋 Login credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:");
    console.log("  Email: admin@example.com");
    console.log("  Password: 123");
    console.log("\nUsers:");
    console.log("  Email: user@gmail.com | Password: 123");
    console.log("  Email: john@example.com | Password: 123");
    console.log("  Email: jane@example.com | Password: 123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Test login
    console.log("\n🧪 Testing login...");
    const testUser = await User.findOne({ email: "user@gmail.com" });
    if (testUser) {
      const isMatch = await testUser.comparePassword("123");
      console.log(`   Email: user@gmail.com`);
      console.log(`   Password: 123`);
      console.log(`   Result: ${isMatch ? '✅ LOGIN SUCCESS' : '❌ LOGIN FAILED'}`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

reseedAllUsers();
