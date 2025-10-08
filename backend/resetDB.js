// Reset and seed database
require("dotenv").config();
const mongoose = require("mongoose");
const House = require("./models/House");
const User = require("./models/User");

const resetAndSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await House.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Run seed scripts
    console.log("📦 Seeding data...");
    
    // Seed users
    const { execSync } = require('child_process');
    execSync('node seed/seedUsers.js', { stdio: 'inherit' });
    
    // Seed houses
    execSync('node seed/seedHouses.js', { stdio: 'inherit' });

    console.log("🎉 Database reset and seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetAndSeed();
