import { db } from "@db";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/httpException";
import { TokenData } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import { compare } from "@utils/encryption";
import { sign } from "@utils/jwt";
import cookie from "cookie";
import { Service } from "typedi";

const createCookie = ({ expiresIn, token }: TokenData) => {
  return cookie.serialize("Authorization", token, {
    httpOnly: true,
    maxAge: expiresIn as number,
  });
};

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    return await db.Users.create({ email: userData.email, password: userData.password });
  }

  public async login(userData: CreateUserDto) {
    const findUser = await db.Users.unscoped().findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    if (!compare(userData.password, findUser.password)) throw new HttpException(409, "Password not matching");

    return { cookie: createCookie(sign({ id: findUser.id })), findUser };
  }

  public async logout(userData: User) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });

    if (findUser && compare(userData.password, findUser.password)) return findUser;

    throw new HttpException(409, "User doesn't exist");
  }
}
