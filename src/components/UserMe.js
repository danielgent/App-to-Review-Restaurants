import React from "react";
import { useLocation, useHistory } from "react-router";
import { useMount } from "react-use";
import { useToast } from "@chakra-ui/core";

import UserContext from "contexts/user-context";
import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import { authAxios } from "utils";

const UserMe = () => {
  const { push } = useHistory();
  const { updateUser } = React.useContext(UserContext);
  const toast = useToast();

  const { pathname } = useLocation();

  useMount(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    // react-router lacks not! routing. Do nothing if on these routes
    if (
      pathname.includes("sign-up") ||
      pathname.includes("login") ||
      pathname.includes("verify")
    ) {
      return;
    }

    // THINK => is this still needed? some request will do the token verification?
    // just need this to update context right.

    if (pathname)
      if (!token) {
        push("/login");
      } else {
        authAxios
          .get(`${process.env.REACT_APP_API_URL}/me`)
          .then(function ({ data }) {
            updateUser({
              role: data.role,
              avatarFilename: data.avatarFilename,
              username: data.username,
              name: data.name,
              email: data.email,
            });
            toast({
              description: "Successfully logged in",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          })
          .catch(function (error) {
            console.log(error);
            toast({
              description: "Need to login again",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            push("/login");
          });
      }
  });

  return null;
};

export default UserMe;
