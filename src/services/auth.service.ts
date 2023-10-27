import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/httpException";
import { TokenData } from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import { UserModel } from "@models/users.model";
import { compare, hash } from "@utils/encryption";
import { sign } from "@utils/jwt";
import { Service } from "typedi";

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = UserModel.find(user => user.email === userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { id: UserModel.length + 1, ...userData, password: hashedPassword };

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = UserModel.find(user => user.email === userData.email);
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching = compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const cookie = createCookie(sign({ id: findUser.id }));

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = UserModel.find(user => user.email === userData.email && user.password === userData.password);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
