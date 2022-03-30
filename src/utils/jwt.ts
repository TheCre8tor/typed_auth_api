import fs from "fs";
import jwt from "jsonwebtoken";
import config from "config";
import log from "./logger";

const private_key = fs.readFileSync("private.key", "utf8");
const public_key = fs.readFileSync("public.pem", "utf8");

// Types -->
type MapObject = { [K: string]: any };
type PrivateAccessKey = "accessTokenPrivateKey" | "refreshTokenPrivateKey";
type PublicAccessKey = "accessTokenPublicKey" | "refreshTokenPublicKey";
type JwtOptions = jwt.SignOptions | undefined;

export function signJwt(
  object: MapObject,
  keyName: PrivateAccessKey,
  options?: JwtOptions
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return jwt.sign(object, private_key, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: PublicAccessKey
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, public_key, {
      algorithms: ["RS256"],
    }) as T;

    return decoded;
  } catch (err) {
    log.debug(err);
    return null;
  }
}
