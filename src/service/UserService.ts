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

  static async getAllNonAdmins(): Promise<UserDetails[] | null> {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("isAdmin", false);
    return data;
  }

  static async getAllUsersDetails() {
    const { data } = await supabase.from("users-details").select("*");

    return data;
  }
}

export type UserFilters = {
  name: string;
  email: string;
};

type UserSignupDetails = {
  email: string;
  password: string;
};

export type UserDetails = {
  id: number;
  createdAt: string;
  email: string;
  password: string;
  groupId: number | null;
  isPending: false;
  isAdmin: false;
  averageScore: number | null;
  averageDuration: number | null;
  name: string;
  surname: string;
  patronymic: string;
  groupName: string;
};
