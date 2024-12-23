import { supabase } from "@/supabase/init";

export default class StatisticsService {
  static async getAll() {
    const result = await supabase.from("statistics").select("*");
    return result.data;
  }
}
