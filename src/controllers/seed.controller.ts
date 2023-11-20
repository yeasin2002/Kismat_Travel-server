import { SeedService } from "@services/seed.service";
import { Controller, Post, Get } from "routing-controllers";
import { Service } from "typedi";

@Controller("/seed")
@Service()
export class SeedController {
  constructor(public seedService: SeedService) {}

  @Post("/airports-data")
  public async seedAirports() {
    await this.seedService.seedAirports();
    return { success: true };
  }

  @Get("/initialization")
  public async seedPaymentsGateway() {
    try {
      const resG = await this.seedService.seedPayments_gateway();
      const profitG = await this.seedService.profit_init();
      return { gateway: resG, profit: profitG };
    } catch (error) {
      return error;
    }
  }

  @Get("/test")
  public async testData() {
    return this.seedService.test();
  }
}
