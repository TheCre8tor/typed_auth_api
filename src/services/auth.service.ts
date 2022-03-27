import { DocumentType } from "@typegoose/typegoose";
import SessionModel from "../models/session.medel";
import { privateFields, User } from "../models/user.model";
import { signJwt } from "../utils/jwt";
import log from "../utils/logger";
import config from "config";
import { omit } from "lodash";

type UserId = { [Key: string]: string };

export async function createSession({ userId }: UserId) {
  return SessionModel.create({ user: userId });
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();

  const accessToken = signJwt(payload, "accessTokenPrivateKey");

  return accessToken;
}

export async function signRefreshToken({ userId }: UserId) {
  const session = await createSession({ userId });

  const refreshToken = signJwt(
    { session: session._id },
    "refreshTokenPrivateKey"
  );

  return refreshToken;
}
