import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ExamsService } from "./user-exams.service";

@Controller("exam")
export class ExamsController {
  constructor(private readonly userExamsService: ExamsService) {}

  @Post("submit")
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
