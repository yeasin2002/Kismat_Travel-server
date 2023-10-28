import { CreateUserDto } from "@dtos/users.dto";
import { User } from "@interfaces/users.interface";
import { ValidationMiddleware } from "@middlewares/validation.middleware";
import { UserService } from "@services/users.service";
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Container } from "typedi";

@Controller()
export class UserController {
  public path = "/users";
  public user = Container.get(UserService);

  @Get("/users")
  @OpenAPI({ summary: "Return a list of users" })
  async getUsers() {
    return await this.user.findAllUser();
  }

  @Get("/users/:id")
  @OpenAPI({ summary: "Return find a user" })
  async getUserById(@Param("id") userId: string) {
    return await this.user.findUserById(userId);
  }

  @Post("/users")
  @HttpCode(201)
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @OpenAPI({ summary: "Create a new user" })
  async createUser(@Body() userData: User) {
    return await this.user.createUser(userData);
  }

  @Put("/users/:id")
  @UseBefore(ValidationMiddleware(CreateUserDto, true))
  @OpenAPI({ summary: "Update a user" })
  async updateUser(@Param("id") userId: string, @Body() userData: User) {
    return await this.user.updateUser(userId, userData);
  }

  @Delete("/users/:id")
  @OpenAPI({ summary: "Delete a user" })
  async deleteUser(@Param("id") userId: string) {
    return await this.user.deleteUser(userId);
  }
}
