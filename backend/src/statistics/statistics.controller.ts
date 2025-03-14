import { Controller } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";

@Controller("exam")
export class ExamsController {
  constructor(private readonly statisticsService: StatisticsService) {}
}
