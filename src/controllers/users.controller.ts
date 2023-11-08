import { UpdatePasswordDto, UserNameDto } from "@dtos/users.dto";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { UserService } from "@services/users.service";
import { Authorized, Body, Controller, Delete, Get, Param, Patch, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";

@Controller("/users")
@Service()
export class UserController {
  constructor(public userService: UserService) {}

  @Authorized()
  @Get()
  @OpenAPI({ summary: "Return a list of users" })
  async getUsers() {
    return await this.userService.findAllUser();
  }

  @Authorized()
  @Get("/:id")
  @OpenAPI({ summary: "Return find a user" })
  async getUserById(@Param("id") userId: string) {
    return await this.userService.findUserById(userId);
  }

  @Authorized()
  @Patch("/:id")
  @UseBefore(ValidationMiddleware(UserNameDto))
  @OpenAPI({ summary: "Change user name" })
  async changeName(@Param("id") userId: string, @Body() body: UserNameDto) {
    return await this.userService.changeName(userId, body.name);
  }

  @Authorized()
  @Put("/:id")
  @UseBefore(ValidationMiddleware(UpdatePasswordDto))
  @OpenAPI({ summary: "Change user name" })
  async changePassword(@Param("id") userId: string, @Body() body: UpdatePasswordDto) {
    return await this.userService.changePassword(userId, body);
  }

  @Authorized()
  @Delete("/:id")
  @OpenAPI({ summary: "Delete a user" })
  async deleteUser(@Param("id") userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
