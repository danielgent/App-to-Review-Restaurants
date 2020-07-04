import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import axios from "axios";

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
      console.count("look am I'm logging");
      // if no token then can even redirect here? UserMe should handle that on mount though as the first request...
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  return newAxios;
})();
