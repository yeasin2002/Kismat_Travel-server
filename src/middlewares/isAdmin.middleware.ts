import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { verify } from "@utils/jwt";
import { compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  CurrentAdmin: any;
  AdminPassCheck: boolean;
}
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const Auth = req.body.Headers;
    if (!Auth?.key && !Auth?.sessions) {
      throw new HttpException(406, "unauthorized request");
    }
    const AdminDecoded: any = verify(Auth.key);
    if (!AdminDecoded.valid) {
      throw new HttpException(406, "Invalid request");
    }
    const admin_in_database = await db.Admin.unscoped().findByPk(AdminDecoded.id);
    if (!admin_in_database) {
      throw new HttpException(406, "Invalid request");
    }
    const verifySession = await compare(Auth.sessions, admin_in_database.sessions);
    if (!verifySession) {
      throw new HttpException(406, "Invalid request");
    }

    // TODO: Check if password is changed
    if (req.body._password) {
      const passwordCompare = await compare(req.body.password, admin_in_database.password);

      if (!passwordCompare) {
        throw new HttpException(406, "Invalid credential");
      } else {
        req.AdminPassCheck = true;
      }
    } else {
      req.AdminPassCheck = false;
    }

    req.CurrentAdmin = admin_in_database.toJSON();
    next();
  } catch (error) {
    next(error);
  }
};
