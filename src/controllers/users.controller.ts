import { CreateUserDto } from "@dtos/users.dto";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { UserService } from "@services/users.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Container } from "typedi";

@Controller("/users")
export class UserController {
  public user = Container.get(UserService);

  @Get()
  @OpenAPI({ summary: "Return a list of users" })
  async getUsers() {
    return await this.user.findAllUser();
  }

  @Get("/:id")
  @OpenAPI({ summary: "Return find a user" })
  async getUserById(@Param("id") userId: string) {
    return await this.user.findUserById(userId);
  }

  @Post()
  @HttpCode(201)
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @OpenAPI({ summary: "Create a new user" })
  async createUser(@Body() userData: User) {
    return await this.user.createUser(userData);
  }

  @Put("/:id")
  @UseBefore(ValidationMiddleware(CreateUserDto, true))
  @OpenAPI({ summary: "Update a user" })
  async updateUser(@Param("id") userId: string, @Body() userData: User) {
    return await this.user.updateUser(userId, userData);
  }

  @Delete("/:id")
  @OpenAPI({ summary: "Delete a user" })
  async deleteUser(@Param("id") userId: string) {
    return await this.user.deleteUser(userId);
  }
}
