import { createClient } from "@supabase/supabase-js";
import config from "../../../env.ts";

export const supabase = createClient(
  config.supabase.url,
  config.supabase.clientKey,
);

export const SupabaseErrorCodes = {
  Duplicate: "23505",
};
