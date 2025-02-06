import { Option } from "@/components/FormBuilder/components/CustomSelect";
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

  static async updateLastActivity(userId: number) {
    const now = new Date().toISOString();

    await supabase
      .from("users")
      .update({ lastActivityDate: now })
      .eq("id", userId);
  }

  static async getLastRegisteredUsers(userId: number) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("lastActivityDate")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching lastActivityDate:", userError);
      return;
    }

    const { data, count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gt("createdAt", userData.lastActivityDate);

    if (error) {
      console.error("Error fetching users count:", error);
      return;
    }
    return count;
  }

  static async getUser(): Promise<void | UserDetails> {
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
    return supabase.from("users").select("*, groups(*)").eq("email", email);
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

  static async getAllUsersDetails(
    filters?: Partial<Filter<UsedFilters>>,
  ): Promise<UserDetails[]> {
    const initialQuery = supabase.from("users-details").select("*").order("id");
    const finalQuery = RequestHelper.applyFilters(initialQuery, filters);

    return (await finalQuery).data;
  }

  static async getAllUsersForSelect(): Promise<Option[]> {
    const initialQuery = supabase
      .from("users-details")
      .select(
        `
      label:name,
      value:id
    `,
      )
      .order("id");

    return (await initialQuery).data || [];
  }

  static async searchByEmailOrName(query: string): Promise<UserDetails[]> {
    const { data } = await supabase
      .from("users-details")
      .select("*")
      .or(
        `email.ilike.%${query}%,name.ilike.%${query}%,surname.ilike.%${query}%`,
      )
      .order("id");

    return data || [];
  }

  static async changeUserAccess(rowId: number, isPending: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ isPending })
      .eq("id", rowId)
      .select("*");

    return { error };
  }

  static async changeUsersAccess(rowIds: number[], isPending: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ isPending })
      .in("id", rowIds);

    return { error };
  }

  static async addUserToPendingList(email: string, fullname: string) {
    const [name, surname] = fullname.split(" ");
    const { error } = await supabase
      .from("users")
      .insert({ email, name, surname })
      .select();

    return error;
  }

  static async changeUserGroup(newGroupId: number | null, userId: number) {
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
  isPending: false;
  isAdmin: false;
  averageScore: number | null;
  averageDuration: number | null;
  name: string;
  surname: string;
  patronymic: string;
  groupId: number;
  groupName: string;
  profileImageUrl: string;
};
