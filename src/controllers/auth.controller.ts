import { ENV, createClientUrl } from "@config";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AuthService } from "@services/auth.service";

import { Response } from "express";
import passport from "passport";

import { Authorized, Body, Controller, Get, HttpCode, Post, Req, Res, UseBefore } from "routing-controllers";
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
  @UseBefore(
    passport.authenticate("google", {
      successRedirect: createClientUrl(ENV.AUTH_SUCCESS_REDIRECT_PATH),
      failureRedirect: createClientUrl(ENV.AUTH_FAILED_REDIRECT_PATH),
    }),
  )
  async googleLogin() {
    return { success: true };
  }

  @Authorized()
  @Post("/logout")
  async logOut(@Req() req: Express.Request, @Res() res: Response) {
    return new Promise<any>((resolve, reject) => {
      req.logOut(err => {
        if (err) {
          reject({ message: "Authentication failed" });
        } else {
          res.redirect(ENV.AUTH_FAILED_REDIRECT_PATH);
          resolve({ success: true });
        }
      });
    });
  }
}
