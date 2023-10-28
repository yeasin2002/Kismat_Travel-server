import { db } from "@db";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/httpException";
import { hash } from "@utils/encryption";
import { Service } from "typedi";

@Service()
export class UserService {
  public async findAllUser() {
    return await db.Users.findAll();
  }

  public async findUserById(userId: string) {
    const findUser = await db.Users.findByPk(userId);
    if (findUser) return findUser;

    throw new HttpException(409, "User doesn't exist");
  }

  public async createUser(userData: CreateUserDto) {
    const findUser = await db.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    return await db.Users.create({ email: userData.email, password: hash(userData.password, 10) });
  }

  public async updateUser(userId: string, userData: Omit<CreateUserDto, "email">) {
    const findUser = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    findUser.password = hash(userData.password, 10);

    await findUser.save();

    return findUser;
  }

  public async deleteUser(userId: string) {
    const findUser = await db.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await findUser.destroy();

    return findUser;
  }
}
