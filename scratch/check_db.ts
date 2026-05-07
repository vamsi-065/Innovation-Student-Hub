import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing ideas table...");
  const { data: ideas, error: ideasError } = await supabase.from("ideas").select("*").limit(1);
  if (ideasError) {
    console.error("Ideas error:", ideasError);
  } else {
    console.log("Ideas sample:", ideas[0]);
  }

  console.log("\nTesting profiles table...");
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(1);
  if (profilesError) {
    console.error("Profiles error:", profilesError);
  } else {
    console.log("Profiles sample:", profiles[0]);
  }
}

test();
