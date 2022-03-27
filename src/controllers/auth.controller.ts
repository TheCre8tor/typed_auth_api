import config from "config";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";

/* EXPLANATION: 

   Auth Controller: Google OAuth | Github OAuth | Facebook OAuth...
   This controller is meant to handle all the logic.

   Auth Controller is used for managing all of the authentication code.
    */

export async function createSessionHandler(req: Request, res: Response) {
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
