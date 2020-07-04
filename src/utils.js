import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import axios from "axios";

// TODO - remove this to make sure everywhere uses useAuthAxios
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

export const authAxios = (() => {
  const newAxios = axios.create();

  newAxios.interceptors.request.use(
    function (config) {
      console.log("look am I'm logging");
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  return newAxios;
})();
