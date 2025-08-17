import { createClient } from "@supabase/supabase-js";
// import "../dotenv/config"; // Loads .env variables

// Initialize supabaseAdmin using your service role key
const supabaseUrl = "http://127.0.0.1:54321";

// need to enter the key here irrespective of it being a bad practice just to add a testuser and check app in dev mode.
// In real life we will not be needing to do this. (Just for testing) :)
const supabaseServiceKey = "service_role key";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createUser() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "testuser@example.com", // change to your email
    password: "NewStrongPassword123!", // change to desired password
    email_confirm: true,
  });

  if (error) console.error("Error creating user:", error);
  else console.log("User created:", data.user.id);
  const userId = data.user.id;
  // 2️⃣ Insert the same user in your `users` table
  const { data: userRow, error: userError } = await supabaseAdmin
    .from("users")
    .insert([
      {
        id: userId,
        email: "testuser@example.com",
        // add other fields if needed, e.g. name, role, etc.
      },
    ]);

  if (userError) {
    console.error("Error inserting user in `users` table:", userError);
  } else {
    console.log("User inserted in `users` table:", userRow);
  }

  // 3️⃣ Insert subscription for this user
  const { data: subscriptionRow, error: subscriptionError } =
    await supabaseAdmin.from("subscriptions").insert([
      {
        user_id: userId,
        monthly_price: 2900, // in USD cents
        status: "active", // default, can be omitted
      },
    ]);

  if (subscriptionError) {
    console.error("Error inserting subscription:", subscriptionError);
    return;
  }

  console.log("Subscription inserted:", subscriptionRow);
}

createUser();
