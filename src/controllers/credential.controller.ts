import { CredentialCreateDto, CredentialUpdateDto } from "@dtos/credential.dto";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { CredentialService } from "@services/credential.service";
import { Body, Controller, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/credential")
@Service()
export class CredentialController {
  constructor(public credentialService: CredentialService) {}

  @Post("/create")
  @UseBefore(ValidationMiddleware(CredentialCreateDto))
  public async create(@Body() credential: CredentialCreateDto) {
    return await this.credentialService.create(credential);
  }

  @Post("/update")
  @UseBefore(ValidationMiddleware(CredentialUpdateDto))
  public async update(@Body() credential: CredentialUpdateDto) {
    return await this.credentialService.update(credential);
  }
}
