import React from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { useMount } from "react-use";

import UserContext from "contexts/user-context";
import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";

const UserMe = ({ history }) => {
  const { updateUser } = React.useContext(UserContext);

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
        .then(function (response) {
          console.log("response");
          // store role + token
        })
        .catch(function (error) {
          // go to login page. redirect here history.push
          console.log(error);
        });
    }
  });

  return null;
};

UserMe.propTypes = {};

export default withRouter(UserMe);
