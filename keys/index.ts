import fs from "fs";

const AT_PRI_KEY = fs.readFileSync("./keys/access_token/private.key", "utf8");
const AT_PUB_KEY = fs.readFileSync("./keys/access_token/public.pem", "utf8");

const RE_PRI_KEY = fs.readFileSync("./keys/refresh_token/private.key", "utf8");
const RE_PUB_KEY = fs.readFileSync("./keys/refresh_token/public.pem", "utf8");

interface Keys {
  ACCESS_TOKEN_PRIVATE_KEY: string;
  ACCESS_TOKEN_PUBLIC_KEY: string;
  REFRESH_TOKEN_PRIVATE_KEY: string;
  REFRESH_TOKEN_PUBLIC_KEY: string;
}

export const keys: Keys = {
  ACCESS_TOKEN_PRIVATE_KEY: AT_PRI_KEY,
  ACCESS_TOKEN_PUBLIC_KEY: AT_PUB_KEY,
  REFRESH_TOKEN_PRIVATE_KEY: RE_PRI_KEY,
  REFRESH_TOKEN_PUBLIC_KEY: RE_PUB_KEY,
};
