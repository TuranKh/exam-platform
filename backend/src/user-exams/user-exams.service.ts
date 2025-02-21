import { HttpStatus, Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";
import { SubmitExamDetails } from "./user-exams.controller";

@Injectable()
export class UserExamsService {
  constructor(private supabaseService: SupabaseService) {}

  async submitExams(examDetails: SubmitExamDetails) {
    const { data, error: existingExamError } = await this.supabaseService
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
    if (existingExamError) {
      return {
        message: "İmtahan məlumatları alarkən xəta baş verdi",
        errorCode: HttpStatus.NOT_FOUND,
      };
    }

    const { data: submittedExamDetails, error } = await this.supabaseService
      .supabase!.from("user-exams")
      .update({ submittedAnswers: examDetails.answers, isFinished: true })
      .eq("id", examDetails.rowId)
      .select()
      .single();

    const examId = submittedExamDetails!.examId;

    const { data: correctAnswerDetails } = await this.supabaseService
      .supabase!.from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    const correctAnswers = JSON.parse(correctAnswerDetails.answers);

    const score = this.calcScore(correctAnswers, examDetails.answers);

    await this.supabaseService
      .supabase!.from("user-exams")
      .update({ score })
      .eq("id", examDetails.rowId);

    if (error) {
      return {
        message: "Cavabları yadda saxlayarkən, xəta baş verdi!",
        errorCode: HttpStatus.BAD_REQUEST,
        error,
      };
    }

    return {
      message: "Cavablar uğurla yadda saxlanıldı",
      errorCode: HttpStatus.OK,
      correctAnswers,
      score,
    };
  }

  calcScore(
    correctAnswers: Record<string, string>,
    userAnswers: Record<string, string | null>,
  ) {
    let score = 0;
    for (const key in correctAnswers) {
      const correctOption = correctAnswers[key];
      const userOption = userAnswers[key];

      if (userOption === null) {
        continue;
      } else if (correctOption === userOption) {
        score += 2;
      } else {
        score -= 0.5;
      }
    }

    return score < 0 ? 0 : score;
  }
}