import { HttpStatus, Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";
import { SubmitExamDetails } from "./user-exams.controller";

@Injectable()
export class UserExamsService {
  constructor(private supabaseService: SupabaseService) {}

  async submitExams(examDetails: SubmitExamDetails) {
    const alreadyExists = await this.supabaseService
      .supabase!.from("user-exams")
      .select("submittedAnswers")
      .not("submittedAnswers", "is", null);

    if (alreadyExists) {
      return {
        message: "Qeyd olunan imtahan üçün artıq cavablar göndərilib",
        errorCode: HttpStatus.BAD_REQUEST,
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
