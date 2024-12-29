import { Filter } from "@/hooks/useFilter";
import { calculateRange } from "@/hooks/usePagination";
import RequestHelper from "@/lib/request-helper";
import { UserExamFilters } from "@/pages/permissions";
import { supabase } from "@/supabase/init";
import { ExamDetails } from "./ExamService";
import { UserDetails } from "./UserService";

export default class UserExamsService {
  static async startExam({ examId, userId }) {
    const now = new Date();
    const { error } = await supabase
      .from("user-exams")
      .update([{ startDate: now }])
      .match({
        userId,
        examId,
      })
      .is("startDate", null);

    return error;
  }

  static async getAll(
    filters: Filter<UserExamFilters>,
    paginationDetails?: PaginationRequest,
  ): Promise<{
    permissions: UserExamDetails[];
    count: number;
  }> {
    const range = calculateRange(paginationDetails);
    const initialQuery = supabase
      .from("user-exams")
      .select(
        `
    id,
    userId,
    examId,
    isFinished,
    score,
    duration,
    totalGivenAttemptsCount,
    hasAccess,
    exams (
      id,
      name,
      duration,
      isActive
    ),
    users!inner (
      id,
      email,
      groupId, 
      name,
      surname, 
      patronymic,
      groups (*)
    )
  `,
        { count: "exact" },
      )
      .order("hasAccess", { ascending: false });

    const finalQuery = RequestHelper.applyFilters(initialQuery, filters);
    finalQuery.range(...range);

    const { data, count } = await finalQuery;
    if (count) {
      return { permissions: data, count };
    }
    return { permissions: [], count: 0 };
  }

  static async changeUserAccess(rowId: number, permission: boolean) {
    const { error } = await supabase
      .from("user-exams")
      .update({ hasAccess: permission })
      .eq("id", rowId)
      .select("*");

    return { error };
  }
}

export type PaginationRequest = {
  page: number;
  perPage: number;
};

export type UserExamDetails = {
  id: number;
  userId: number;
  examId: number;
  isFinished: boolean;
  score: number;
  duration: number;
  totalGivenAttemptsCount: number;
  hasAccess: boolean;
  exams: Partial<ExamDetails>;
  users: Partial<UserDetails>;
};
