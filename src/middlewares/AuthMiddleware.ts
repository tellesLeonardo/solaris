import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.header("Authorization")?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return response.sendStatus(403);
      }
      request.user = user;
      next();
    });
  } else {
    response.sendStatus(401);
  }
};
