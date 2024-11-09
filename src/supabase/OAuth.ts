import { supabase } from "./init";

export default async function OAuthSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "/dashboard",
    },
  });

  return [data, error];
}
