import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
// import { HttpException } from "@exceptions/http.exception";
// import { RequestWithUser } from "@interfaces/auth.interface";

import { AuthMiddleware } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AuthService } from "@services/auth.service";

import { Response } from "express";
import passport from "passport";

import { Body, Controller, Get, HttpCode, Post, Req, Res, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Controller("/auth")
@Service()
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post("/signup")
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @HttpCode(201)
  async signUp(@Body() userData: CreateUserDto, @Req() req: Express.Request) {
    if (req.isAuthenticated()) throw new HttpException(403, "User already login!");

    const newUser = await this.authService.signup(userData);

    return new Promise<any>((resolve, reject) => {
      req.login(newUser, err => {
        if (err) {
          reject({ message: "Authentication failed" });
        } else {
          delete newUser.password;
          resolve({ success: true, auth: newUser });
        }
      });
    });
  }

  @Post("/login")
  @UseBefore(ValidationMiddleware(CreateUserDto), passport.authenticate("local"))
  async logIn() {
    return { success: true };
  }

  @Get("/google")
  @UseBefore(passport.authenticate("google"))
  async googleLogin() {
    return { success: true };
  }

  @Post("/logout")
  @UseBefore(AuthMiddleware)
  async logOut(@Res() res: Response) {
    res.clearCookie("authorization");
    return { success: true };
  }
}
