/**
 * Test API endpoints without running server
 * This simulates what frontend does
 */

const testLoginAPI = async () => {
  console.log("🧪 Testing Login API Endpoint\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const testCases = [
    { email: "user@gmail.com", password: "123" },
    { email: "admin@example.com", password: "123" },
    { email: "wrong@email.com", password: "123" },
    { email: "user@gmail.com", password: "wrong" },
  ];

  for (const { email, password } of testCases) {
    console.log(`\n📤 Testing login:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`   ✅ SUCCESS - Status: ${response.status}`);
        console.log(`   👤 User: ${data.user.username}`);
        console.log(`   📧 Email: ${data.user.email}`);
        console.log(`   🎭 Role: ${data.user.role}`);
      } else {
        console.log(`   ❌ FAILED - Status: ${response.status}`);
        console.log(`   💬 Message: ${data.message}`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      
      if (error.message.includes('fetch')) {
        console.log(`   ⚠️  Backend server is not running!`);
        console.log(`   💡 Run: npm start (in backend folder)`);
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n✅ API test complete!");
};

// Check if backend is running first
const checkBackend = async () => {
  console.log("🔍 Checking if backend is running...\n");
  
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Backend is running!");
      console.log(`   Status: ${data.status}`);
      console.log(`   Uptime: ${Math.floor(data.uptime)}s\n`);
      return true;
    }
  } catch (error) {
    console.log("❌ Backend is NOT running!");
    console.log("💡 Please start backend first:");
    console.log("   cd backend");
    console.log("   npm start\n");
    return false;
  }
};

// Main
(async () => {
  const isRunning = await checkBackend();
  
  if (isRunning) {
    await testLoginAPI();
  } else {
    console.log("⚠️  Cannot test API - backend is not running");
    process.exit(1);
  }
})();
