import { UpdatePasswordDto, UserNameDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { UserService } from "@services/users.service";
import { configureMulterOption } from "@utils/multer";
import { Response } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { Authorized, Body, Controller, CurrentUser, Delete, Get, Param, Patch, Post, Put, Res, UploadedFile, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { isAdmin } from "@middlewares/isAdmin.middleware";

const avatarFolder = join(__dirname, "../__images/user/avatar");

@Controller("/users")
@Service()
export class UserController {
  constructor(public userService: UserService) {}

  @Post()
  @UseBefore(isAdmin)
  @OpenAPI({ summary: "Return a list of users" })
  async getUsers() {
    return await this.userService.findAllUser();
  }

  @Authorized()
  @Get("/:id")
  @OpenAPI({ summary: "Return find a user" })
  async getUserById(@CurrentUser() user: User) {
    delete user.password;
    return user;
  }

  @Authorized()
  @Patch("/:id")
  @UseBefore(ValidationMiddleware(UserNameDto))
  @OpenAPI({ summary: "Change user name" })
  async changeName(@CurrentUser() user: User, @Body() body: UserNameDto) {
    return await this.userService.changeName(user.id, body.name);
  }

  @Authorized()
  @Put("/:id")
  @UseBefore(ValidationMiddleware(UpdatePasswordDto))
  @OpenAPI({ summary: "Change user name" })
  async changePassword(@CurrentUser() user: User, @Body() body: UpdatePasswordDto) {
    return await this.userService.changePassword(user.id, body);
  }

  @Authorized()
  @Post("/:id")
  @OpenAPI({ summary: "Upload profile picture" })
  async changePhotoUrl(
    @UploadedFile("profile", { options: configureMulterOption({ path: avatarFolder }) }) File: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return await this.userService.changePhotoUrl(user.id, File.filename);
  }

  @Get("/avatar/:avatar")
  @OpenAPI({ summary: "Upload profile picture" })
  async getAvatar(@Param("avatar") avatarName: string, @Res() res: Response) {
    const file = join(avatarFolder, avatarName);

    if (!existsSync(file)) throw new HttpException(404, "Avatar not found");
    res.sendFile(file);
    return res;
  }

  @Authorized()
  @Delete("/:id")
  @OpenAPI({ summary: "Delete a user" })
  async deleteUser(@CurrentUser() user: User) {
    return await this.userService.deleteUser(user.id);
  }
}
