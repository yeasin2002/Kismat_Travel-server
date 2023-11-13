import { db } from "@db";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { User } from "@interfaces/users.interface";
import { sign } from "@utils/jwt";
import { Service } from "typedi";

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const createdUser = await db.Users.create({ email: userData.email, password: userData.password, name: userData.name });
    return createdUser.toJSON();
  }

  public async login(user: User) {
    user && user.password && delete user.password;
    return { user, auth: sign({ id: user.id }) };
  }
}
