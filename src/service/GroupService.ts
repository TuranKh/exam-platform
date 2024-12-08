import { Filter } from "@/hooks/useFilter";
import RequestHelper from "@/lib/request-helper";
import { GroupFilters } from "@/pages/users";
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

  static async getAll(
    filters: Filter<GroupFilters>,
  ): Promise<GroupDetails[] | null> {
    const initialQuery = supabase.from("groups").select("*");
    const finalQuery = RequestHelper.applyFilters(initialQuery, filters);

    return (await finalQuery).data;
  }
}

export type GroupDetails = {
  id: number;
  createdAt: string;
  name: string;
  description: string;
};
