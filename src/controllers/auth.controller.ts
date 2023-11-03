import { ENV, createClientUrl } from "@config";
import { CreateUserDto, SingInUserDto, UpdatePasswordDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { AuthService } from "@services/auth.service";
import { body } from "@utils/swagger";
import passport from "passport";
import { Authorized, Body, Controller, CurrentUser, Get, HttpCode, Post, Put, Redirect, Req, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
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
          resolve(newUser);
        }
      });
    });
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
  )
  @Redirect(createClientUrl(ENV.AUTH_SUCCESS_REDIRECT_PATH))
  async googleLoginCallback() {
    /* */
  }

  @Authorized()
  @Post("/signout")
  async logOut(@Req() req: Express.Request) {
    return await new Promise<any>((resolve, reject) => {
      req.logOut(err => {
        if (err) {
          reject({ message: "Authentication failed" });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  @Authorized()
  @Put("/change-password")
  @UseBefore(ValidationMiddleware(UpdatePasswordDto))
  async updatePassword(@CurrentUser() user: User, @Body() credentials: UpdatePasswordDto) {
    return this.authService.passwordChange(user, credentials);
  }
}
