require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

/**
 * Test login directly with MongoDB Cloud
 * This will verify passwords are working correctly
 */

const testLogin = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Cloud...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected\n");

    // Test credentials
    const testCases = [
      { email: "user@gmail.com", password: "123" },
      { email: "admin@example.com", password: "123" },
      { email: "john@example.com", password: "123" },
    ];

    console.log("🧪 Testing login for all users:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    for (const { email, password } of testCases) {
      console.log(`\n👤 Testing: ${email}`);
      
      // Find user
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`   ❌ User not found in database`);
        continue;
      }

      console.log(`   ✅ User found: ${user.username}`);
      console.log(`   🔑 Password hash: ${user.password.substring(0, 30)}...`);
      console.log(`   📝 Plain password: ${user.plainPassword || 'N/A'}`);

      // Test password
      const isMatch = await user.comparePassword(password);
      
      if (isMatch) {
        console.log(`   ✅ LOGIN SUCCESS - Password "${password}" is correct!`);
      } else {
        console.log(`   ❌ LOGIN FAILED - Password "${password}" is incorrect!`);
        
        // Debug info
        console.log(`   🔍 Debug info:`);
        console.log(`      - Input password: "${password}"`);
        console.log(`      - Stored hash: ${user.password}`);
        console.log(`      - Hash starts with: ${user.password.substring(0, 4)}`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📊 Summary:");
    
    const allUsers = await User.find({});
    console.log(`   Total users in database: ${allUsers.length}`);
    
    let hashedCount = 0;
    let plainCount = 0;
    
    for (const user of allUsers) {
      const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
      if (isHashed) {
        hashedCount++;
      } else {
        plainCount++;
        console.log(`   ⚠️  Plain password found: ${user.email}`);
      }
    }
    
    console.log(`   ✅ Hashed passwords: ${hashedCount}`);
    console.log(`   ❌ Plain passwords: ${plainCount}`);
    
    if (plainCount > 0) {
      console.log("\n⚠️  WARNING: Some passwords are still plain text!");
      console.log("   Run: node fixPasswords.js");
    } else {
      console.log("\n✅ All passwords are properly hashed!");
    }

    mongoose.connection.close();
    console.log("\n✅ Test complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testLogin();
