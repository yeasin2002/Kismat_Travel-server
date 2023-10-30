import { db } from "@db";
import { CreateUserDto, UpdatePasswordDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { User } from "@interfaces/users.interface";
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

  public async login() {
    return { success: true };
  }

  public async logout() {
    return { success: true };
  }

  public async passwordChange(user: User, credentials: UpdatePasswordDto) {
    const dbUser = await db.Users.unscoped().findByPk(user.id);

    if (!compare(credentials["current-password"], dbUser.password)) {
      return new HttpException(401, "Authentication failed");
    }

    dbUser.password = credentials.password;
    await dbUser.save();

    return { success: true };
  }
}
