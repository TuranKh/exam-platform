import config from "@shared/env";
import { supabase } from "./init";

export default async function OAuthSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${config.clientUrl}/home`,
    },
  });

  return [data, error];
}
