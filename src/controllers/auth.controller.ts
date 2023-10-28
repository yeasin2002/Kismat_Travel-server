import { CreateUserDto } from "@dtos/users.dto";
import { RequestWithUser } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import { AuthMiddleware } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AuthService } from "@services/auth.service";
import { Response } from "express";
import { Body, Controller, HttpCode, Post, Req, Res, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/auth")
@Service()
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post("/signup")
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @HttpCode(201)
  async signUp(@Body() userData: User) {
    return await this.authService.signup(userData);
  }

  @Post("/login")
  @UseBefore(ValidationMiddleware(CreateUserDto))
  async logIn(@Res() res: Response, @Body() userData: User) {
    const { cookie, findUser } = await this.authService.login(userData);

    res.setHeader("Set-Cookie", [cookie]);
    return findUser;
  }

  @Post("/logout")
  @UseBefore(AuthMiddleware)
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const logOutUserData = await this.authService.logout(req.user);

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
    return logOutUserData;
  }
}
