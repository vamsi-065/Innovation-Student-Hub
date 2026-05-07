import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables'); // This might not work if the function doesn't exist
  if (error) {
    console.log("RPC get_tables failed, trying direct SQL via query (if possible) or just checking specific common names.");
    
    const tables = ["profiles", "users", "ideas", "Idea", "User"];
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select("*").limit(0);
      if (tableError) {
        console.log(`Table '${table}': NOT FOUND or ERROR:`, tableError.message);
      } else {
        console.log(`Table '${table}': FOUND`);
      }
    }
  } else {
    console.log("Tables:", data);
  }
}

listTables();
