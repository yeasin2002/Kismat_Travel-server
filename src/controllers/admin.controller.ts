import { CreateAdminDto } from "@dtos/admins.dto";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AdminService } from "@services/admins.service";
import { Body, Controller, Delete, Get, Param, Put, UseBefore, Post } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";

@Controller("/admins")
@Service()
export class AdminController {
  constructor(public AdminService: AdminService) {}

  @Post()
  @OpenAPI({ summary: "Test login User" })
  async getUsers(@Body() BodyData: any) {
    return await this.AdminService.loginAdmin(BodyData);
  }
}
