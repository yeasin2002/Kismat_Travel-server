import { SearchDto } from "@dtos/index";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { StaticsService } from "@services/statics.service";
import { Body, Controller, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/statics")
@Service()
export class StaticsController {
  constructor(public staticsService: StaticsService) {}

  @Post("/search")
  @UseBefore(ValidationMiddleware(SearchDto))
  public async addSearchHistory(@Body() body: { search: Record<string, any> }) {
    return await this.staticsService.createSearch(body.search);
  }
}
