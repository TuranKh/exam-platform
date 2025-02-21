import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { UserExamsService } from "./user-exams.service";
import { Response } from "express";

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
