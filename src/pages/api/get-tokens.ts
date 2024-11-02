// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || "");

  res.status(200).json({
    [ACCESS_TOKEN.name]: cookies[ACCESS_TOKEN.name],
    [REFRESH_TOKEN.name]: cookies[REFRESH_TOKEN.name],
  });
}
