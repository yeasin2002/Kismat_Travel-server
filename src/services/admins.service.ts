/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@db";
import { CreateAdminDto } from "@dtos/admins.dto";
import { HttpException } from "@exceptions/http.exception";
import { sign } from "@utils/jwt";
import generateSessionCode from "@utils/session";
import { compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
export class AdminService {
  public async findAllUser() {
    const resArray = await db.Admin.findAll();
    return resArray.map(_v => _v.toJSON());
  }

  public async findUserById(userId: string) {
    const findUser = await db.Admin.findByPk(userId);
    if (findUser) return findUser.toJSON();

    throw new HttpException(409, "User doesn't exist");
  }

  public async updateUser(AdminId: string, userData: Omit<CreateAdminDto, "email">) {
    const findUser = await db.Admin.unscoped().findByPk(AdminId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    findUser.password = userData.password;
    await findUser.save();

    const userJSON = findUser.toJSON();
    delete userJSON.password;

    return userJSON;
  }

  public async deleteUser(AdminId: string) {
    const findUser = await db.Admin.findByPk(AdminId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await findUser.destroy();

    return findUser.toJSON();
  }

  public async loginAdmin({ email, password }: { email: string; password: string }) {
    if (!email && !password) {
      throw new HttpException(406, "Email And Password are required");
    }
    const AdminInDatabase = await db.Admin.unscoped().findOne({
      where: {
        email,
      },
    });
    if (!AdminInDatabase) throw new HttpException(401, "No User Wrong Credential");

    if (await compare(password, AdminInDatabase.toJSON().password)) {
      const session = generateSessionCode(15);
      await db.Admin.update(
        { sessions: session },
        {
          where: {
            email,
          },
        },
      );

      const Payload = AdminInDatabase.toJSON();
      delete Payload.password;
      return { session: session, jwt: sign(Payload), value: Payload };
    } else {
      throw new HttpException(401, "Wrong Credential");
    }
  }

  public async logout(id: string) {
    await db.Admin.update({ sessions: "" }, { where: { id } });
    return true;
  }

  public async changePhotoUrl(AdminId: string, photoUrl: string) {
    const findAdmin = await db.Admin.findByPk(AdminId);
    if (!findAdmin) throw new HttpException(409, "Admin doesn't exist");

    findAdmin.photo = photoUrl;
    await findAdmin.save();

    return findAdmin.toJSON();
  }
}
