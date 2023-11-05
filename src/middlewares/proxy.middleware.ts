import { NextFunction, Request, Response } from "express";

export function modifyProxy(req: Request, _: Response, next: NextFunction) {
  req.headers["Authorization"] = "Bearer YourAccessToken";

  next();
}
