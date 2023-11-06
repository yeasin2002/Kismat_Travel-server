import { FlyhubService } from "@services/flyhub.service";
import { Controller } from "routing-controllers";
import { Service } from "typedi";

@Controller("/fly-hub")
@Service()
export class FlyhubController {
  constructor(public flyHubService: FlyhubService) {}
}
