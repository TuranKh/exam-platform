import { supabase } from "@/supabase/init";
import { ExamDetails } from "./ExamService";
import { UserDetails } from "./UserService";
import { calculateRange } from "@/hooks/usePagination";

export default class UserExamsService {
  static async startExam({ examId, userId, deadline }) {
    const { data, error } = await supabase
      .from("user-exams")
      .insert([{ examId, userId, deadline }])
      .select();
  }

  static async getAll(paginationDetails?: PaginationRequest): Promise<{
    permissions: UserExamDetails[];
    count: number;
  }> {
    const range = calculateRange(paginationDetails);

    const { data, count } = await supabase
      .from("user-exams")
      .select(
        `
    id,
    userId,
    examId,
    isFinished,
    score,
    duration,
    attemptCount,
    hasAccess,
    exams (
      id,
      name,
      duration,
      isActive
    ),
    users (
      id,
      email,
      groupId, 
      name,
      surname, patronymic
    )
  `,
        { count: "exact" },
      )
      .order("hasAccess", { ascending: false })
      .range(...range);
    if (count) {
      return { permissions: data, count };
    }
    return { permissions: [], count: 0 };
  }

  static async changeUserAccess(rowId: number, permission: boolean) {
    console.log(permission);
    console.log(rowId);
    const { data, error } = await supabase
      .from("user-exams")
      .update({ hasAccess: permission })
      .eq("id", rowId)
      .select("*");

    console.log(data);
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
  attemptCount: number;
  hasAccess: boolean;
  exams: Partial<ExamDetails>;
  users: Partial<UserDetails>;
};
