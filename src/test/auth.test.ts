import { App } from "@/app";
import { AuthController } from "@controllers/auth.controller";
import { CreateUserDto } from "@dtos/users.dto";
import request from "supertest";

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing Auth", () => {
  describe("[POST] /signup", () => {
    it("response should have the Create userData", () => {
      const userData: CreateUserDto = {
        email: "test@email.com",
        password: "q1w2e3r4",
      };

      const app = new App([AuthController]);
      return request(app.getServer()).post("/signup").send(userData);
    });
  });

  describe("[POST] /login", () => {
    it("response should have the Set-Cookie header with the Authorization token", async () => {
      const userData: CreateUserDto = {
        email: "lim@gmail.com",
        password: "q1w2e3r4",
      };

      const app = new App([AuthController]);
      return request(app.getServer())
        .post("/login")
        .send(userData)
        .expect("Set-Cookie", /^Authorization=.+/);
    });
  });
});
