import { ENV, createClientUrl } from "@config";
import { CreateUserDto, SingInUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AuthService } from "@services/auth.service";
import { sign } from "@utils/jwt";
import { body } from "@utils/swagger";
import { Response } from "express";
import passport from "passport";
import { Authorized, Body, Controller, CurrentUser, Get, HttpCode, Post, Req, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";

@Controller("/auth")
@Service()
export class AuthController {
  constructor(public authService: AuthService) {}

  @Authorized()
  @Get("/current")
  currentUser(@CurrentUser() user: User) {
    delete user.password;
    return user;
  }

  @Post("/signup")
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @HttpCode(201)
  async signUp(@Body() userData: CreateUserDto, @Req() req: Express.Request) {
    if (req.isAuthenticated()) throw new HttpException(403, "User already login!");

    const newUser = await this.authService.signup(userData);
    delete newUser.password;

    return { auth: sign({ id: newUser.id }), user: newUser };
  }

  @Post("/signin")
  @UseBefore(ValidationMiddleware(SingInUserDto), passport.authenticate("local", { session: false }))
  @OpenAPI(body("SingInUserDto"))
  async logIn(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Get("/google")
  @UseBefore(passport.authenticate("google", { session: false }))
  async googleLogin(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Get("/google/callback")
  @UseBefore(
    passport.authenticate("google", {
      failureRedirect: createClientUrl(ENV.AUTH_FAILED_REDIRECT_PATH),
      session: false,
    }),
    function (req: RequestWithUser, res: Response) {
      const url = new URL(createClientUrl(ENV.AUTH_SUCCESS_REDIRECT_PATH));
      url.searchParams.set("redirect-id", sign({ id: req.user.id }));
      res.redirect(url.toString());
    },
  )
  async googleLoginCallback() {}
}
