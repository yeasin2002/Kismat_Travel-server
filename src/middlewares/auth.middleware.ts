import { HttpException } from "@exceptions/httpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import { UserModel } from "@models/users.model";
import { verify } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";

const getAuthorization = (req: Request) => {
  if (req.cookies["Authorization"]) return req.cookies["Authorization"];

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authorization = getAuthorization(req);

    if (!authorization) return next(new HttpException(404, "Authentication token missing"));

    const payload = verify<DataStoredInToken>(authorization);

    if (!payload.valid) return next(new HttpException(401, "Wrong authentication token"));

    const findUser = UserModel.find(user => user.id === payload.id);

    if (findUser) {
      req.user = findUser;
      return next();
    }

    next(new HttpException(401, "Wrong authentication token"));
  } catch (error) {
    next(error);
  }
};
