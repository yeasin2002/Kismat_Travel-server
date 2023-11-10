import { SeedService } from "@services/seed.service";
import { Controller, Post, Get } from "routing-controllers";
import { Service } from "typedi";
import { HttpException } from "@exceptions/http.exception";

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
      return { success: true };
    } catch (error) {
      return error;
    }
  }
}
