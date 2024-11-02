import cyfaxApiClient from "@/cyfax-api-client";
import axios from "axios";

export const getRequestReportMutationOptions = () => {
  return {
    mutationKey: ["request-report"],
    mutationFn: (data: { email: string }) =>
      cyfaxApiClient.post<{ data: string }>("/request_report/", data),
  };
};

export const getLoginMutationOptions = () => {
  return {
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) =>
      axios.post("/api/login", data),
  };
};
export const getLogoutMutationOptions = () => {
  return {
    mutationFn: () => axios.post("/api/logout"),
    mutationKey: ["logout"],
  };
};

export const getRefreshAccessTokenMutationOptions = () => {
  return {
    mutationKey: ["refresh-access-token"],
    mutationFn: () =>
      axios.post<{ accessToken: null | string }>("/api/refresh-access-token"),
  };
};

export const getDownloadPDFMutationOptions = () => {
  return {
    mutationKey: ["download-pdf"],
    mutationFn: ({ file_path }: { file_path: string }) =>
      cyfaxApiClient.post(
        "/pdf_report/",
        { file_path },
        {
          responseType: "blob", // This is important to handle the response as a blob
        },
      ),
  };
};
