import { FlyhubService } from "@services/flyhub.service";
import { Authorized, Body, Controller, CurrentUser, Post } from "routing-controllers";
import { Service } from "typedi";
import { User } from "@interfaces/users.interface";

@Controller("/fly-hub")
@Service()
export class FlyhubController {
  constructor(public flyHubService: FlyhubService) {}

  @Authorized()
  @Post("/airprebook")
  public async AirPreBook(@Body() body: any, @CurrentUser() _user: User) {
    return this.flyHubService.AirPreBook(body, _user);
  }
}
