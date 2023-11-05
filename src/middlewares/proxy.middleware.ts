import { getAuthorizeHeader } from "@utils/authorize";
import { NextFunction, Request, Response } from "express";

export async function modifyProxy(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = await getAuthorizeHeader();
    req.headers["Authorization"] = `Bearer ${authorization}`;
    next();
  } catch (error) {
    next(error);
  }
}
