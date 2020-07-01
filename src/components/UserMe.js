import React from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { useMount } from "react-use";
import { useToast } from "@chakra-ui/core";

import UserContext from "contexts/user-context";
import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";

const UserMe = ({ history }) => {
  const { updateUser } = React.useContext(UserContext);
  const toast = useToast();

  useMount(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!token) {
      history.push("/login");
    } else {
      console.log("token ", token);

      axios
        .get(`${process.env.REACT_APP_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function ({ data }) {
          updateUser({ role: data.role, token });
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

UserMe.propTypes = {};

export default withRouter(UserMe);