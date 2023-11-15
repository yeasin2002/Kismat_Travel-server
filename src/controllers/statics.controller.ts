import { SearchDto } from "@dtos/index";
import { isAdmin } from "@middlewares/isAdmin.middleware";
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

  @Post("/todays")
  @UseBefore(isAdmin)
  public async getTodaysStatics() {
    const [todaysSearchesCount, todaysNewUserCount, todaysBookingsCount, todaysPreBookingsCount] = await Promise.all([
      this.staticsService.getTodaysSearchesCount(),
      this.staticsService.getTodaysUserSignupCount(),
      this.staticsService.getTodaysBookingsCount(),
      this.staticsService.getTodaysPreBookingsCount(),
    ]);

    return {
      todaysSearchesCount,
      todaysNewUserCount,
      todaysBookingsCount,
      todaysPreBookingsCount,
      success: true,
    };
  }
}
