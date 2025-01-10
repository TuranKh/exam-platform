import { Filter } from "@/hooks/useFilter";
import RequestHelper from "@/lib/request-helper";
import { GroupFilters } from "@/pages/groups";
import { supabase } from "@/supabase/init";
export default class GroupService {
  static async getAllForSelect(addNullOption = true) {
    const result = await supabase.from("groups").select(`
      label:name, 
      value:id
    `);
    if (result.data && addNullOption) {
      return [
        ...result.data,
        {
          label: "Qrupsuz",
          value: "null",
        },
      ];
    }

    return result.data;
  }

  static async delete(groupId: number) {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    return error;
  }

  static async getAll(
    filters: Filter<GroupFilters>,
  ): Promise<GroupDetails[] | null> {
    const initialQuery = supabase
      .from("groups")
      .select("*, users(count)", { count: "exact" });
    const finalQuery = RequestHelper.applyFilters(initialQuery, filters);

    return (await finalQuery).data;
  }

  static async create(groupName: string) {
    const response = await supabase
      .from("groups")
      .insert({
        name: groupName,
      })
      .select();
    return response;
  }
}

export type GroupDetails = {
  id: number;
  createdAt: string;
  name: string;
  users: [{ count: number }];
  description: string;
};
