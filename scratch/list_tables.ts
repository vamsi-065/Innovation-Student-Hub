import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('get_tables'); // This might not work if RPC doesn't exist
  if (error) {
     // Try standard query to information_schema if allowed
     const { data: tables, error: tablesError } = await supabase.from('pg_catalog.pg_tables').select('tablename').eq('schemaname', 'public');
     console.log("Tables:", tables || tablesError);
  } else {
    console.log("Tables:", data);
  }
}

test();
