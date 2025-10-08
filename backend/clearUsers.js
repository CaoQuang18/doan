require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const clearUsers = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Cloud...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Cloud");

    // Delete all users except admin
    const result = await User.deleteMany({ role: "user" });
    console.log(`🗑️  Deleted ${result.deletedCount} users`);

    // Show remaining users
    const remainingUsers = await User.find();
    console.log("\n📋 Remaining users:");
    remainingUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
    });

    console.log("\n✅ Done! You can now register new users.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

clearUsers();
