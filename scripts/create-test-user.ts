import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  const email = "admin@tastyfruit.com";
  const password = "password123";

  console.log(`Creating test user: ${email}...`);

  // Check if user exists first to avoid error or duplicate
  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Error listing users:", listError.message);
    return;
  }

  const existingUser = listData.users.find((u) => u.email === email);

  if (existingUser) {
    console.log(
      "User already exists inside Supabase Auth. Updating password..."
    );
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password, email_confirm: true }
    );

    if (updateError) {
      console.error("Error updating password:", updateError.message);
    } else {
      console.log("Password updated successfully.");
    }
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Admin Tester" },
  });

  if (error) {
    console.error("Error creating user:", error.message);
  } else {
    console.log("User created successfully:", data.user.id);
  }
}

createTestUser();
