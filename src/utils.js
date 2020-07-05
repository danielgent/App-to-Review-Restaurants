import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import axios from "axios";

export const disallowWhitespaceChangeHandler = (onChange) => (e) =>
  onChange({
    target: {
      name: e.target.name,
      value: e.target.value.trim(),
    },
  });

// TODO - most basic example. Force redirect
export const authAxios = (() => {
  const newAxios = axios.create();

  newAxios.interceptors.request.use(
    function (config) {
      // if no token then can even redirect here? UserMe should handle that on mount though as the first request...
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  newAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        console.error("Token invalid");
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

        // TODO - first round. Not ideal. Should use react-router but couldn't get history object here
        window.location.href = "/login?invalid_token";
      }
      return Promise.reject(error);
    }
  );

  return newAxios;
})();

export const convertIsoStringToDateObject = (isoString) => {
  const [y, m, d] = isoString.split("-");

  const convertedDate = new Date(y, m - 1, d);

  return convertedDate;
};

export const convertDateObjectToIsoString = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const makeImageUrl = (filename) =>
  filename.includes("http")
    ? filename
    : `${process.env.REACT_APP_API_URL}/${filename}`;
