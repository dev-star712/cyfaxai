import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    res.setHeader("Set-Cookie", [
      cookie.serialize(ACCESS_TOKEN.name, "", {
        ...ACCESS_TOKEN.options,
        expires: new Date(0),
      }),
      cookie.serialize(REFRESH_TOKEN.name, "", {
        ...REFRESH_TOKEN.options,
        expires: new Date(0),
      }),
    ]);

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
