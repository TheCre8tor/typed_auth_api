import jwt from "jsonwebtoken";
import log from "./logger";

// Types -->
type MapObject = { [K: string]: any };
type JwtOptions = jwt.SignOptions | undefined;

export function signJwt(
  object: MapObject,
  key_name: string,
  options?: JwtOptions
) {
  return jwt.sign(object, key_name, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string, key_name: string): T | null {
  try {
    const decoded = jwt.verify(token, key_name, {
      algorithms: ["RS256"],
    }) as T;

    return decoded;
  } catch (err) {
    log.debug(err);
    return null;
  }
}
