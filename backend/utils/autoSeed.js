const User = require("../models/User");
const House = require("../models/House");

// Auto seed data if database is empty
const autoSeed = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: "123",
        role: "admin"
      });
      console.log("✅ Auto-seeded admin user");
    }

    // DISABLED: Auto-seed sample users - Let users register themselves
    // const userCount = await User.countDocuments({ role: "user" });
    // if (userCount === 0) {
    //   const usersData = [
    //     {
    //       username: "User Test",
    //       email: "user@gmail.com",
    //       password: "123",
    //       role: "user",
    //       address: "123 Test Street",
    //       dateOfBirth: "1990-01-01"
    //     },
    //     {
    //       username: "John Doe",
    //       email: "john@example.com",
    //       password: "123",
    //       role: "user",
    //       address: "456 Main St",
    //       dateOfBirth: "1995-05-15"
    //     }
    //   ];

    //   for (const userData of usersData) {
    //     await User.create(userData);
    //   }
    //   console.log("✅ Auto-seeded sample users");
    // }
    console.log("ℹ️  Sample users auto-seed disabled - Users will register themselves");

    // Check if houses exist
    const houseCount = await House.countDocuments();
    if (houseCount === 0) {
      console.log("📦 Seeding houses from seed file...");
      // Run the seed script
      const { execSync } = require('child_process');
      try {
        execSync('node seed/seedHouses.js', { cwd: __dirname + '/..' });
        console.log("✅ Auto-seeded all houses from seed file");
      } catch (err) {
        console.error("❌ Failed to run seed script:", err.message);
        // Fallback: seed minimal data
        const minimalHouses = [
          {
            type: "House",
            name: "Sample House",
            description: "Beautiful house with modern amenities.",
            image: "/assets/img/houses/house1.png",
            imageLg: "/assets/img/houses/house1lg.png",
            country: "United States",
            address: "7240C Argyle St. Lawndale, CA 90260",
            bedrooms: "6",
            bathrooms: "3",
            surface: "4200 sq ft",
            year: "2016",
            price: 110000,
            status: "Trả phòng",
            agent: {
              image: "/assets/img/agents/agent1.png",
              name: "Patricia Tullert",
              phone: "0123 456 78910"
            }
          }
        ];
        await House.insertMany(minimalHouses);
        console.log("✅ Seeded minimal house data");
      }
    }

    console.log("🎉 Database ready!");
  } catch (error) {
    console.error("❌ Auto-seed error:", error);
  }
};

module.exports = autoSeed;
