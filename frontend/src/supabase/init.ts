import config from "@shared/env";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  config.supabase.url,
  config.supabase.clientKey,
);

export const SupabaseErrorCodes = {
  Duplicate: "23505",
};
