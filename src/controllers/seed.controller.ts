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
      await this.seedService.seedPayments_gateway();
      await this.seedService.profit_init();
      return { success: true };
    } catch (error) {
      return error;
    }
  }
}
