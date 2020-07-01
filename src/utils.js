import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";

export const getAuthHeader = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
};
