import { HttpException } from "@exceptions/http.exception";
import { verify } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";
import { db } from "@db";
import { compare } from "bcryptjs";

interface CustomRequest extends Request {
  CurrentAdmin: any;
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
    const admin_in_database = await db.Admin.findByPk(AdminDecoded.id);
    if (!admin_in_database) {
      throw new HttpException(406, "Invalid request");
    }
    const verifySession = await compare(Auth.sessions, admin_in_database.sessions);
    if (!verifySession) {
      throw new HttpException(406, "Invalid request");
    }
    req.CurrentAdmin = admin_in_database.toJSON();
    next();
  } catch (error) {
    next(error);
  }
};
