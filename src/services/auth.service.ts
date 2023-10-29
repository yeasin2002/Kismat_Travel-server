import { db } from "@db";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { compare } from "@utils/encryption";
import { Service } from "typedi";

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const createdUser = await db.Users.create({ email: userData.email, password: userData.password });
    return createdUser.toJSON();
  }

  public async login(userData: CreateUserDto) {
    const findUser = await db.Users.unscoped().findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);
    if (!compare(userData.password, findUser.password)) throw new HttpException(409, "Password not matching");
    return findUser.toJSON();
  }

  public async logout(userData: CreateUserDto) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });

    if (findUser && compare(userData.password, findUser.password)) return findUser;

    throw new HttpException(409, "User doesn't exist");
  }
}
