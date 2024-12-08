import { Filter } from "@/hooks/useFilter";
import RequestHelper from "@/lib/request-helper";
import { UsedFilters } from "@/pages/users";
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

  static async getAllUsersDetails(filters: Filter<UsedFilters>) {
    const initialQuery = supabase.from("users-details").select("*");
    const finalQuery = RequestHelper.applyFilters(initialQuery, filters);

    return (await finalQuery).data;
  }

  static async changeUserAccess(rowId: number, isPending: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ isPending })
      .eq("id", rowId)
      .select("*");

    return { error };
  }

  static async changeUserGroup(newGroupId: number, userId: number) {
    const response = await supabase
      .from("users")
      .update({ groupId: newGroupId })
      .eq("id", userId);

    return response.error;
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
