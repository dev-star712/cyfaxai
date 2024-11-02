import { CookieSerializeOptions } from "cookie";

export const ACCESS_TOKEN: { name: string; options: CookieSerializeOptions } = {
  name: "access_token",
  options: {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 60, // 60 days
    sameSite: "strict",
    path: "/",
  },
};

export const REFRESH_TOKEN: { name: string; options: CookieSerializeOptions } =
  {
    name: "refresh_token",
    options: {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      path: "/",
    },
  };
