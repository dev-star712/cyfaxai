import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import routes from "@/constants/routes";
import {
  getLogoutMutationOptions,
  getRefreshAccessTokenMutationOptions,
} from "@/cyfax-api-client/mutations";
import { getAuthTokenOnClient } from "@/lib/utils";
import { appCache } from "@/node-cache";
import axios, {
  AxiosError,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseConfig: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL,
};

const cyfaxApiClient = axios.create(baseConfig);

cyfaxApiClient.interceptors.request.use(async (req) => {
  try {
    const tokens = await getAuthTokenOnClient();

    if (tokens?.accessToken)
      req.headers.Authorization = `Bearer ${tokens.accessToken}`;

    return req;
  } catch (error) {
    return req;
  }
});

cyfaxApiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest: CustomAxiosRequestConfig | undefined = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = await getAuthTokenOnClient();

        if (!refreshToken) {
          return;
        }

        const response =
          await getRefreshAccessTokenMutationOptions().mutationFn();
        const accessToken = response.data.accessToken;

        if (!accessToken) {
          throw new AxiosError("Unauthenticated");
        }

        appCache.set(ACCESS_TOKEN.name, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return cyfaxApiClient(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError) {
          getLogoutMutationOptions()
            .mutationFn()
            .then(() => {
              appCache.del(ACCESS_TOKEN.name);
              appCache.del(REFRESH_TOKEN.name);
              window.location.href = routes.login;
            });
        }
      }
    }

    return Promise.reject(error);
  },
);

export default cyfaxApiClient;
