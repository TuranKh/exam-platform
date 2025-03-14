import { Filter } from "@/hooks/useFilter";
import RequestHelper from "@/lib/request-helper";
import { UserExamFilters } from "@/pages/permissions";
import { supabase } from "@/supabase/init";

export default class StatisticsService {
  static async getAll(
    filters: Filter<UserExamFilters>,
  ): Promise<StatsResponse[]> {
    const initialQuery = supabase.from("statistics").select("*");
    const finalQuery = await RequestHelper.applyFilters(initialQuery, filters);

    return finalQuery.data;
  }
}

export type StatsResponse = {
  userExamId: number;
  userId: number;
  groupId: number | null;
  examId: number;
  score: number | null;
  isFinished: boolean | null;
  examName: string;
  userName: string;
  userSurname: string | null;
};
