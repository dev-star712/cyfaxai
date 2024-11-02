import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import { getApiErrorMessage } from "@/lib/utils";
import { appCache } from "@/node-cache";
import axios from "axios";
import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body;

  try {
    const response = await axios.post<{ access: string; refresh: string }>(
      "/user/token/",
      body,
      {
        baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
      },
    );

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    appCache.set(ACCESS_TOKEN.name, accessToken);
    appCache.set(REFRESH_TOKEN.name, refreshToken);

    res.setHeader("Set-Cookie", [
      cookie.serialize(ACCESS_TOKEN.name, accessToken, ACCESS_TOKEN.options),
      cookie.serialize(REFRESH_TOKEN.name, refreshToken, REFRESH_TOKEN.options),
    ]);

    res.status(200).json({ success: true });
  } catch (error: any) {
    res
      .status(error?.response?.status || 500)
      .json({ message: getApiErrorMessage(error) });
  }
}
