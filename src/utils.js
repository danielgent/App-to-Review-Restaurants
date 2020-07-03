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

export const disallowWhitespaceChangeHandler = (onChange) => (e) =>
  onChange({
    target: {
      name: e.target.name,
      value: e.target.value.trim(),
    },
  });
