import ObjectFormatter from "@/lib/object-formatter";
import RequestHelper from "@/lib/request-helper";
import { supabase } from "@/supabase/init";
export default class ExamService {
  static async getAllExams(filters?: ExamFilters) {
    const validFilters = ObjectFormatter.removeNullishValues(filters);
    if (validFilters) {
      return this.filterExams(validFilters);
    }

    const result = await supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false });

    return result.data;
  }

  static async filterExams(filters?: Partial<ExamFilters>) {
    let result = supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false });

    if (filters) {
      result = RequestHelper.applyFilters(result, filters);
    }

    return (await result).data as ExamDetails[] | null;
  }

  static async getExam(examId: number, isTeacher = false) {
    if (isTeacher) {
      const result: { data: ExamDetails[] | null } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId);
      return result.data?.[0];
    }

    const result: { data: ExamDetails[] | null } = await supabase
      .from("exams")
      .select("name, duration, questionsCount, questions")
      .eq("id", examId);

    return result.data?.[0];
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
}

export type NewExamDetails = {
  name: string;
  duration: number;
  questionsCount: number;
  questions: string;
  answers: string;
};

export type ExamDetails = NewExamDetails & {
  id: number;
  createdAt: string;
  participantsCount: number;
  isActive: boolean;
};

export type ExamFilters = {
  createdAt: Date;
  name: string;
  isActive: boolean;
};
