import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { UserExamsService } from "./user-exams.service";

@Controller("submit-answers")
export class UserExamsController {
  constructor(private readonly userExamsService: UserExamsService) {}

  @Post()
  async submitExam(
    @Res() response: Response,
    @Body() examDetails: SubmitExamDetails,
  ): Promise<unknown> {
    const { errorCode, ...rest } =
      await this.userExamsService.submitExams(examDetails);
    return response.status(errorCode).send(rest);
  }
}

export type SubmitExamDetails = {
  answers: Record<string, string>;
  rowId: number;
};