import { SeedService } from "@services/seed.service";
import { Controller, Post } from "routing-controllers";
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
}
