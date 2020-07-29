import React from "react";
import GoogleLogin from "react-google-login";
import { useToast } from "@chakra-ui/core";
import axios from "axios";
import { useHistory } from "react-router";

import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import UserContext from "contexts/user-context";

const GoogleLogIn = () => {
  const toast = useToast();
  const { updateUser } = React.useContext(UserContext);
  const { push } = useHistory();

  const responseGoogle = (response) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/google/verify/${response.tokenId}`)
      .then(({ data }) => {
        updateUser({
          role: data.role,
          avatarFilename: data.avatarFilename,
          username: data.username,
          name: data.name,
          email: data.email,
        });

        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);

        toast({
          description: "Successfully logged in with Google",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        push("/");
      })
      .catch((err) => {
        toast({
          description: "No account registered with this Google Id",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      // TODO - fail gracefully here
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLogIn;
