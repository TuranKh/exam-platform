import { supabase } from "@/supabase/init";
import { User, UserResponse } from "@supabase/supabase-js";

export default class UserService {
  static basePath = "/user";

  static signUp({ email, password }: UserSignupDetails) {
    return supabase.auth.signUp({
      email,
      password,
    });
  }

  static getUser(): Promise<UserResponse> {
    return supabase.auth.getUser();
  }
}

type UserSignupDetails = {
  email: string;
  password: string;
};
