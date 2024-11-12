import { supabase } from "@/supabase/init";

export default class UserService {
  static basePath = "/user";

  static signUp({ email, password }: UserSignupDetails) {
    return supabase.auth.signUp({
      email,
      password,
    });
  }

  static async getUser() {
    const userDetails = await supabase.auth.getUser();
    if (userDetails.data.user?.email) {
      const localUserDetails = await UserService.getLocalUser(
        userDetails.data.user?.email,
      );
      return localUserDetails.data?.[0];
    }
  }

  static getLocalUser(email: string) {
    return supabase.from("users").select("*").eq("email", email);
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return error;
  }
}

type UserSignupDetails = {
  email: string;
  password: string;
};
