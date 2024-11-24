import RequestHelper from "@/lib/request-helper";
import { supabase } from "@/supabase/init";

export default class UserService {
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

  static async filterUsers(filters?: Partial<UserFilters>) {
    let result = supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false });

    if (filters) {
      result = RequestHelper.applyFilters(result, filters);
    }

    return (await result).data as UserFilters[] | null;
  }

  static getLocalUser(email: string) {
    return supabase.from("users").select("*").eq("email", email);
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return error;
  }
}

export type UserFilters = {
  name: string,
  email: string
}

type UserSignupDetails = {
  email: string;
  password: string;
};
