import { LoginAdminDto } from "@dtos/admins.dto";
import { HttpException } from "@exceptions/http.exception";
import { isAdmin } from "@middlewares/isAdmin.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AdminService } from "@services/admins.service";
import { configureMulterOption } from "@utils/multer";
import { Request, Response } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { promisify } from "util";

interface CustomRequest extends Request {
  CurrentAdmin: any;
}

const avatarFolder = join(__dirname, "../__images/admin/avatar");

@Controller("/admins")
@Service()
export class AdminController {
  constructor(public AdminService: AdminService) {}

  @Post("/login")
  @UseBefore(ValidationMiddleware(LoginAdminDto))
  @OpenAPI({ summary: "Test login User" })
  async getUsers(@Body() BodyData: any, @Res() response: Response) {
    const User = await this.AdminService.loginAdmin(BodyData);
    response.cookie("session", User.session, { maxAge: 3600000 });
    response.cookie("key", User.jwt, { maxAge: 3600000 });
    delete User.value.sessions;

    return User;
  }

  @Post("/auth")
  @UseBefore(isAdmin)
  @OpenAPI({ summary: "Test login User" })
  async AdminAuth(@Req() request: CustomRequest) {
    return request.CurrentAdmin;
  }

  @Post("/logout")
  @UseBefore(isAdmin)
  async AdminLogout(@Req() request: CustomRequest) {
    return this.AdminService.logout(request.CurrentAdmin.id);
  }

  @Post("/photo-upload")
  @UseBefore(isAdmin)
  async changeUserPhotoUrl(
    @UploadedFile("avatar", { options: configureMulterOption({ path: avatarFolder }) }) File: Express.Multer.File,
    @Req() request: CustomRequest,
  ) {
    return await this.AdminService.changePhotoUrl(request.CurrentAdmin.id, File.filename);
  }

  @Get("/avatar/:avatar")
  async getAvatar(@Param("avatar") avatarName: string, @Res() res: Response) {
    const file = join(avatarFolder, avatarName);
    if (!existsSync(file)) throw new HttpException(404, "Avatar not found");
    await promisify(res.sendFile.bind(res))(file);
    return res;
  }
}
