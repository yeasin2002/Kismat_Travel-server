import { db } from "@db";
import { UpdatePasswordDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/http.exception";
import { compare } from "@utils/encryption";
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

  public async changeName(id: string, name: string) {
    const findUser = await db.Users.findByPk(id);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    findUser.name = name;
    findUser.save();

    return findUser.toJSON();
  }

  public async changePassword(id: string, credentials: UpdatePasswordDto) {
    const findUser = await db.Users.unscoped().findByPk(id);

    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (!compare(credentials.current, findUser.password)) throw new HttpException(401, "Authentication failed");

    findUser.password = credentials.password;
    await findUser.save();

    return { success: true };
  }

  public async changePhotoUrl(id: string, filename: string) {
    const findUser = await db.Users.findByPk(id);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    findUser.photoUrl = filename;
    await findUser.save();

    return findUser.toJSON();
  }

  public async deleteUser(userId: string) {
    const findUser = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await findUser.destroy();

    return { success: true };
  }
}
