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
    const error = await this.userExamsService.submitExams(examDetails);
    return response.status(error.errorCode).send({
      message: error.message,
    });
  }
}

export type SubmitExamDetails = {
  answers: string;
  rowId: number;
};
