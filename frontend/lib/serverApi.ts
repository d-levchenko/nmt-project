import { apiClient } from "./apiClient";

export const serverRefreshSession = async (cookie: string) => {
  return apiClient.get("/auth/refresh", {
    headers: {
      Cookie: cookie,
    },
  });
};
