#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

console.log("🔍 Testing Supabase Connection...\n");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test products table
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .limit(5);

    if (productsError) {
      console.log("❌ Products query failed:", productsError.message);
    } else {
      console.log("✅ Products table:", products.length, "items found");
      if (products.length > 0) {
        console.log("   Sample:", products[0].name);
      }
    }

    // Test recipes table
    const { data: recipes, error: recipesError } = await supabase
      .from("recipes")
      .select("*")
      .limit(5);

    if (recipesError) {
      console.log("❌ Recipes query failed:", recipesError.message);
    } else {
      console.log("✅ Recipes table:", recipes.length, "items found");
      if (recipes.length > 0) {
        console.log("   Sample:", recipes[0].title);
      }
    }

    // Test publications table
    const { data: publications, error: publicationsError } = await supabase
      .from("publications")
      .select("*")
      .limit(5);

    if (publicationsError) {
      console.log("❌ Publications query failed:", publicationsError.message);
    } else {
      console.log("✅ Publications table:", publications.length, "items found");
      if (publications.length > 0) {
        console.log("   Sample:", publications[0].title);
      }
    }

    console.log("\n🎉 Supabase connection successful!");
    console.log("🚀 You can now run: bun run dev");
  } catch (error) {
    console.log("❌ Connection test failed:", error.message);
  }
}

testConnection();
