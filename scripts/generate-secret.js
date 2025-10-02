#!/usr/bin/env node

const crypto = require("crypto");

console.log("🔐 Generating NEXTAUTH_SECRET...\n");

const secret = crypto.randomBytes(32).toString("base64");

console.log("Generated secret:");
console.log(secret);
console.log("\nAdd this to your .env file:");
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log("");
