#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Checking Supabase Environment Setup...\n");

// Check if .env file exists
const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found!");
  console.log(
    "📝 Please copy .env.example to .env and fill in your Supabase credentials\n"
  );
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, "utf8");

// Check required variables
const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
];

const missingVars = [];
const placeholderVars = [];

requiredVars.forEach((varName) => {
  const regex = new RegExp(`${varName}=(.+)`);
  const match = envContent.match(regex);

  if (!match) {
    missingVars.push(varName);
  } else {
    const value = match[1].trim();
    if (value.includes("your-") || value.includes("YOUR_") || value === "") {
      placeholderVars.push(varName);
    }
  }
});

if (missingVars.length > 0) {
  console.log("❌ Missing environment variables:");
  missingVars.forEach((varName) => console.log(`   - ${varName}`));
  console.log("");
}

if (placeholderVars.length > 0) {
  console.log("⚠️  Environment variables with placeholder values:");
  placeholderVars.forEach((varName) => console.log(`   - ${varName}`));
  console.log("");
}

if (missingVars.length === 0 && placeholderVars.length === 0) {
  console.log("✅ All environment variables are set!");
  console.log("🚀 You can now run: bun run dev");
} else {
  console.log("📖 Please follow the setup guide in scripts/setup-supabase.md");
  console.log("🔗 Or check the Supabase dashboard for your credentials");
}

console.log("");
