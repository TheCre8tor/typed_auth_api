import { NextFunction, Request, Response } from "express";
import { keys } from "../../keys";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization || "";
  const accessToken = bearerToken.replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }

  const decoded = verifyJwt(accessToken, keys.ACCESS_TOKEN_PUBLIC_KEY);

  console.log(decoded);
  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
