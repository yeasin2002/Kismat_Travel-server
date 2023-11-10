import { AdminService } from "@services/admins.service";

import { Request, Response } from "express";
import { Body, Controller, Post, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";

import { isAdmin } from "@middlewares/isAdmin.middleware";

interface CustomRequest extends Request {
  CurrentAdmin: any;
}

@Controller("/admins")
@Service()
export class AdminController {
  constructor(public AdminService: AdminService) {}

  @Post("/login")
  // @UseBefore(ValidationMiddleware(LoginAdminDto))
  @OpenAPI({ summary: "Test login User" })
  async getUsers(@Body() BodyData: any, @Res() response: Response, @Req() request: Request) {
    const User = await this.AdminService.loginAdmin(BodyData);
    response.cookie("session", User.session, { maxAge: 3600000 });
    response.cookie("key", User.jwt, { maxAge: 3600000 });
    delete User.value.sessions;
    // Get the user's IP address
    const userIP = request.ip;
    //TODO: make a email for wrong login request.
    console.log("🚀: ", userIP);
    return User;
  }

  @Post("/auth")
  @UseBefore(isAdmin)
  @OpenAPI({ summary: "Test login User" })
  async AdminAuth(@Body() BodyData: any, @Res() response: Response, @Req() request: CustomRequest) {
    return request.CurrentAdmin;
  }

  @Post("/logout")
  @UseBefore(isAdmin)
  async AdminLogout(@Res() response, @Req() request: CustomRequest) {
    return this.AdminService.logout(request);
  }
}
