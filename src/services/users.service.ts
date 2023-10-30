import { db } from "@db";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { Service } from "typedi";

@Service()
export class UserService {
  public async findAllUser() {
    const resArray = await db.Users.findAll();
    return resArray.map(_v => _v.toJSON());
  }

  public async findUserById(userId: string) {
    const findUser = await db.Users.findByPk(userId);
    if (findUser) return findUser.toJSON();

    throw new HttpException(409, "User doesn't exist");
  }

  public async updateUser(userId: string, userData: Omit<CreateUserDto, "email">) {
    const findUser = await db.Users.unscoped().findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    findUser.password = userData.password;
    await findUser.save();

    const userJSON = findUser.toJSON();
    delete userJSON.password;

    return userJSON;
  }

  public async deleteUser(userId: string) {
    const findUser = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await findUser.destroy();

    return findUser.toJSON();
  }
}
