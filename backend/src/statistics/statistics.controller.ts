import { Controller } from "@nestjs/common";

@Controller("exam")
export class ExamsController {
  constructor(private readonly statisticsService: StatisticsService) {}
}
