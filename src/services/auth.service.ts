import { DocumentType } from "@typegoose/typegoose";
import SessionModel from "../models/session.medel";
import { privateFields, User } from "../models/user.model";
import { signJwt } from "../utils/jwt";
import { omit } from "lodash";
import { keys } from "../../keys";

type UserId = { [Key: string]: string };

export async function createSession({ userId }: UserId) {
  return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, keys.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "1m",
  });

  return accessToken;
}

export async function signRefreshToken({ userId }: UserId) {
  const session = await createSession({ userId });

  const refreshToken = signJwt(
    { session: session._id },
    keys.REFRESH_TOKEN_PRIVATE_KEY,
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
}
