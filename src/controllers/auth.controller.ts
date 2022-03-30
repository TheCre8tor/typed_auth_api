import config from "config";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { keys } from "../../keys";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";

/* EXPLANATION: 

   Auth Controller: Google OAuth | Github OAuth | Facebook OAuth...
   This controller is meant to handle all the logic.

   Auth Controller is used for managing all of the authentication code.
    */

export async function createSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password }: CreateSessionInput = req.body;
  const message = "Invalid email or password";

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    return res.send(message);
  }

  // 1. sign a access token
  const accessToken = signAccessToken(user);

  // 2. sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // 3. send the tokens
  res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.headers["x-refresh"]?.toString() || "";

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    keys.REFRESH_TOKEN_PUBLIC_KEY
  );

  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh access token");
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  const accessToken = signAccessToken(user);

  return res.send({ accessToken });
}
