import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProfileInsert() {
  const testId = "00000000-0000-0000-0000-000000000000";
  const testEmail = "test@example.com";
  
  console.log("Attempting test insert into 'profiles'...");
  
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: testId,
      email: testEmail,
      full_name: "Test User",
      role: "STUDENT"
    })
    .select();

  if (error) {
    console.error("INSERT ERROR:", JSON.stringify(error, null, 2));
    
    if (error.message.includes("column \"full_name\" does not exist")) {
       console.log("Column 'full_name' is missing. Trying 'name' instead...");
       const { error: error2 } = await supabase
         .from("profiles")
         .insert({
           id: testId,
           email: testEmail,
           name: "Test User",
           role: "STUDENT"
         });
       if (error2) console.error("INSERT WITH 'name' ALSO FAILED:", error2.message);
       else console.log("INSERT WITH 'name' SUCCEEDED!");
    }
  } else {
    console.log("INSERT SUCCEEDED:", data);
  }
}

debugProfileInsert();
