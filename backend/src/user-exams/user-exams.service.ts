import { HttpStatus, Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";
import { SubmitExamDetails } from "./user-exams.controller";

@Injectable()
export class UserExamsService {
  constructor(private supabaseService: SupabaseService) {}

  async submitExams(examDetails: SubmitExamDetails) {
    const {data, error} = await this.supabaseService
      .supabase!.from("user-exams")
      .select("submittedAnswers")
      .eq("id", examDetails.rowId)
      .not("submittedAnswers", "is", null);

    if (data?.length) {
      return {
        message: "Qeyd olunan imtahan üçün artıq cavablar göndərilib",
        errorCode: HttpStatus.BAD_REQUEST,
      };
    }
    if (error) {
      return {
        message: "İmtahan məlumatları alarkən xəta baş verdi",
        errorCode: HttpStatus.NOT_FOUND,
      };
    }

    const { error } = await this.supabaseService
      .supabase!.from("user-exams")
      .update({ submittedAnswers: examDetails.answers, isFinished: true })
      .eq("id", examDetails.rowId)
      .select("*");

    return {
      message: "Cavabları yadda saxlayarkən, xəta baş verdi!",
      errorCode: HttpStatus.BAD_REQUEST,
    };
  }
}
