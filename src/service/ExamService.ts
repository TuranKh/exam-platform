import { supabase } from "@/supabase/init";

export default class ExamService {
  static async getAllExams() {
    const result: { data: ExamDetails[] | null } = await supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false });

    return result.data;
  }

  static async getExam(examId: number) {
    const result: { data: ExamDetails[] | null } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId);
    return result.data;
  }

  static async createExam(examDetails: NewExamDetails) {
    const { data } = await supabase
      .from("exams")
      .insert([examDetails])
      .select();

    return data;
  }

  static async updateExam(id: number, examDetails: NewExamDetails) {
    const { data } = await supabase
      .from("exams")
      .update(examDetails)
      .eq("id", id)
      .select("*");

    return data;
  }

  static async updateExamStatus(id: number, isActive: boolean) {
    const { error } = await supabase
      .from("exams")
      .update({ isActive })
      .eq("id", id)
      .select("*");

    return error;
  }

  static async deleteExam(id: number) {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    return error;
  }

  static async filterExams() {
    let { data: exams, error } = await supabase
      .from("exams")
      .select("*")

      // Filters
      .eq("column", "Equal to")
      .gt("column", "Greater than")
      .lt("column", "Less than")
      .gte("column", "Greater than or equal to")
      .lte("column", "Less than or equal to")
      .like("column", "%CaseSensitive%")
      .ilike("column", "%CaseInsensitive%")
      .is("column", null)
      .in("column", ["Array", "Values"])
      .neq("column", "Not equal to")

      // Arrays
      .contains("array_column", ["array", "contains"])
      .containedBy("array_column", ["contained", "by"]);
  }
}

export type ExamFilter = {
  name: string;
  date: string;
  isActive: boolean;
};

export type NewExamDetails = {
  name: string;
  duration: number;
  questionsCount: number;
  questions: string;
};

export type ExamDetails = NewExamDetails & {
  id: number;
  createdAt: string;
  participantsCount: number;
  isActive: boolean;
};
