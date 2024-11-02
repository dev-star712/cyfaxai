// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import { getApiErrorMessage } from "@/lib/utils";
import axios from "axios";
import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = cookie.parse(req.headers.cookie || "");

  const refreshToken = cookies[REFRESH_TOKEN.name];

  if (!refreshToken) {
    return res.status(401).json({ accessToken: null });
  }

  try {
    const response = await axios.post<{ access: string }>(
      "/user/token/refresh/",
      {
        refresh: refreshToken,
      },
      {
        baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
      },
    );

    const accessToken = response.data.access;
    res.setHeader("Set-Cookie", [
      cookie.serialize(ACCESS_TOKEN.name, accessToken, ACCESS_TOKEN.options),
    ]);
    res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error("Error refreshing token:", error);  

    res.setHeader("Set-Cookie", [  
      cookie.serialize(ACCESS_TOKEN.name, "", { expires: new Date(0), path: '/' }),  
      cookie.serialize(REFRESH_TOKEN.name, "", { expires: new Date(0), path: '/' }),  
    ]);  

    return res.status(error?.response?.status || 500).json({  
      message: getApiErrorMessage(error),  
      accessToken: null,  
    });  
  }
}
