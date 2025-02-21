import { Filter } from "@/hooks/useFilter";
import { calculateRange } from "@/hooks/usePagination";
import RequestHelper from "@/lib/request-helper";
import { UserExamFilters } from "@/pages/permissions";
import { supabase } from "@/supabase/init";
import { ExamDetails } from "./ExamService";
import { UserDetails } from "./UserService";
import { httpClient } from "@/config/HttpClient";

export default class UserExamsService {
  static async startExam(rowId: number) {
    const { data } = await supabase.rpc("start_exam", { row_id: rowId });
    return data;
  }

  static async incrementAttemptCount(rowId: number) {
    const { error } = await supabase.rpc("increment_attempts", {
      row_id: rowId,
    });

    return error;
  }

  static async decrementAttemptsCount(rowId: number) {
    const { error } = await supabase.rpc("decrement_attempts", {
      row_id: rowId,
    });

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
      isAdmin,
      groups (*)
    )
  `,
        { count: "exact" },
      )
      .order("id")
      .order("hasAccess", { ascending: false })
      .eq("users.isAdmin", false);

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
      .eq("id", rowId);

    return { error };
  }

  static async changeUsersAccess(rowIds: number[], permission: boolean) {
    const { error } = await supabase
      .from("user-exams")
      .update({ hasAccess: permission })
      .in("id", rowIds);

    return { error };
  }

  static async submitAnswers(
    rowId: number,
    answers: Record<string, string | null>,
  ) {
    const response = await httpClient.post("submit-answers", {
      rowId,
      answers,
    });

    return response.data;
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
