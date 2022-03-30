import { NextFunction, Request, Response } from "express";
import { keys } from "../../keys";
import { verifyJwt } from "../utils/jwt";

const routeGuard = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization || "";
  const accessToken = bearerToken.replace(/^Bearer\s/, "");

  if (!accessToken) {
    return res.send({
      message: "Access Token is required to access this resource!",
    });
  }

  const decoded = verifyJwt(accessToken, keys.ACCESS_TOKEN_PUBLIC_KEY);

  if (decoded) {
    res.locals.user = decoded;
  } else {
    return res.send({ message: "Invalid access token" });
  }

  return next();
};

export default routeGuard;
