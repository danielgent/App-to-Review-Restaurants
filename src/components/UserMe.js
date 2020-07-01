import React from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { useMount } from "react-use";
import { useToast } from "@chakra-ui/core";

import UserContext from "contexts/user-context";
import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import { getAuthHeader } from "utils";

const UserMe = ({ history }) => {
  const { updateUser } = React.useContext(UserContext);
  const toast = useToast();

  useMount(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) {
      history.push("/login");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/me`, {
          headers: getAuthHeader(),
        })
        .then(function ({ data }) {
          updateUser({
            role: data.role,
            avatarFilename: data.avatarFilename,
            username: data.username,
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
          history.push("/login");
        });
    }
  });

  return null;
};

// TODO - useHistory hook
export default withRouter(UserMe);
