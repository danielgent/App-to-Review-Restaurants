import React from "react";
import GoogleLogin from "react-google-login";
import { useToast } from "@chakra-ui/core";
import axios from "axios";
import { useHistory } from "react-router";

const GoogleSignUp = () => {
  const toast = useToast();
  const { push } = useHistory();

  const responseGoogle = (response) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/google/create`, {
        token: response.tokenId,
      })
      .then(({ data }) => {
        toast({
          description: "Successfully created account with Google. Please login",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        push("/login");
      })
      .catch((err) => {
        console.log("err ", err);
        toast({
          description: "Sign up failed with this Google Id",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Create an account with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleSignUp;
