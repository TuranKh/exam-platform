import { supabase } from "@/supabase/init";
import { ExamDetails } from "./ExamService";

export default class UserExamsService {
  static async startExam({ examId, userId, deadline }) {
    const { data, error } = await supabase
      .from("user-exams")
      .insert([{ examId, userId, deadline }])
      .select();
  }

  static async getAll(): Promise<UserExamDetails[]> {
    const result = await supabase.from("user-exams").select(`
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
  `);

    return result.data || [];
  }
}

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
  users: Partial<any>;
};
