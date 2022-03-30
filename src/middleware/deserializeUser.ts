import { NextFunction, Request, Response } from "express";
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

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  console.log(decoded);
  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
