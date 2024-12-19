import { Filter } from "@/hooks/useFilter";
import ObjectFormatter from "@/lib/object-formatter";
import RequestHelper from "@/lib/request-helper";
import { supabase } from "@/supabase/init";
import { PaginationRequest } from "./UserExamsService";
import { calculateRange, PaginationDetails } from "@/hooks/usePagination";
export default class ExamService {
  static async getAllExams(
    filters: Filter<ExamFilters>,
    paginationDetails?: PaginationRequest,
  ) {
    const range = calculateRange(paginationDetails);
    const validFilters = ObjectFormatter.removeNullishValues(filters);
    if (validFilters) {
      return ExamService.filterExams(validFilters, range);
    }

    const result = await supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(...range);

    return result.data;
  }

  static async filterExams(
    filters: Partial<ExamFilters>,
    range: [number, number],
  ) {
    let result = supabase
      .from("exams")
      .select("*")
      .order("createdAt", { ascending: false });

    result = RequestHelper.applyFilters(result, filters).range(...range);

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

  static async getAllForSelect() {
    const result = await supabase.from("exams").select(`
      label:name, 
      value:id
    `);

    return result.data;
  }

  static async getAllForUserSelect() {
    const { data: exams } = await supabase
      .from("user-specific-exams")
      .select("exams!inner(value:id, label:name)");

    return exams?.map((examDetails) => {
      return examDetails.exams;
    });
  }

  static async createExam(examDetails: NewExamDetails) {
    const { data, error } = await supabase
      .from("exams")
      .insert([{ ...examDetails, createdAt: new Date() }])
      .select();
    if (error) {
      throw Error(error.message);
    }
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

  static async getUserSpecificExams(
    filters: Filter,
    paginationDetails: PaginationDetails,
  ) {
    const range = calculateRange(paginationDetails);
    const validFilters = ObjectFormatter.removeNullishValues(filters);
    if (validFilters) {
      return ExamService.filterExams(validFilters, range);
    }
    return (await supabase.from("user-specific-exams").select("*")).data;
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
