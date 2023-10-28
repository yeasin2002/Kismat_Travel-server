import { AirportsService } from "@services/airports.service";
import { Controller, Get, QueryParam } from "routing-controllers";
import Container from "typedi";

@Controller("/airports")
export class AirportController {
  public seed = Container.get(AirportsService);

  @Get()
  public async getAirports(@QueryParam("q") search: string, @QueryParam("page") page: number, @QueryParam("docs-per-page") limit: number) {
    return await this.seed.getAirports(search, page, limit);
  }
}
