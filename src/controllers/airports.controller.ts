import { AirportsService } from "@services/airports.service";
import { Controller, Get, QueryParam } from "routing-controllers";
import { Service } from "typedi";

@Controller("/airports")
@Service()
export class AirportController {
  constructor(public airportService: AirportsService) {}

  @Get()
  public async getAirports(@QueryParam("q") search: string, @QueryParam("page") page: number, @QueryParam("docs-per-page") limit: number) {
    return await this.airportService.getAirports(search, page, limit);
  }
}
