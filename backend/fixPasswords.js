require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

/**
 * Script to fix all passwords in database
 * This will hash all plain text passwords
 */

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users`);

    let fixed = 0;
    let skipped = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
      
      console.log(`\n👤 User: ${user.email}`);
      console.log(`   Password: ${user.password.substring(0, 20)}...`);
      console.log(`   Is hashed: ${isHashed}`);

      if (!isHashed) {
        // Password is plain text, need to hash it
        const plainPassword = user.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        // Update directly without triggering pre-save hook
        await User.updateOne(
          { _id: user._id },
          { 
            $set: { 
              password: hashedPassword,
              plainPassword: plainPassword // Store plain for admin view
            } 
          }
        );
        
        console.log(`   ✅ Fixed! Hashed password: ${hashedPassword.substring(0, 20)}...`);
        console.log(`   📝 Plain password stored: ${plainPassword}`);
        fixed++;
      } else {
        console.log(`   ⏭️  Already hashed, skipping`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Fixed: ${fixed} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users`);
    console.log(`   📝 Total: ${users.length} users`);

    // Test login with first user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n🧪 Testing login with: ${testUser.email}`);
      
      // Reload user to get updated password
      const updatedUser = await User.findById(testUser._id);
      const testPassword = updatedUser.plainPassword || "123"; // Default test password
      
      const isMatch = await updatedUser.comparePassword(testPassword);
      console.log(`   Password: ${testPassword}`);
      console.log(`   Match: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    }

    mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixPasswords();
