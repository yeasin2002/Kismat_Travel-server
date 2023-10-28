import { SeedService } from "@services/seed.service";
import { Controller, Post } from "routing-controllers";
import Container from "typedi";

@Controller("/seed")
export class SeedController {
  public seed = Container.get(SeedService);

  @Post("/airports-data")
  public async seedAirports() {
    await this.seed.seedAirports();
    return { success: true };
  }
}
