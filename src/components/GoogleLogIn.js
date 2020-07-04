import React from "react";
import GoogleLogin from "react-google-login";
import { Text, Flex, useToast } from "@chakra-ui/core";
import axios from "axios";

const GoogleLogIn = () => {
  const toast = useToast();

  const responseGoogle = (response) => {
    console.log(response);

    axios
      .get(`${process.env.REACT_APP_API_URL}/google/verify/${response.tokenId}`)
      .then(({ data }) => {
        console.log("token validated yes ok");
        // TODO =>  actually login here and set userdata
        // should get everything back in the token right
      })
      .catch((err) => {
        // TODO - can't read codes here? WTF Axios. Just gives me an error object
        console.log("FAIL");
        console.log("err ", err);
        toast({
          description: "No account registered with this Google Id",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex alignItems="center" justifyContent="center" p={4}>
      <Text fontStyle="italic" color="gray.400" mr={2}>
        or sign in with
      </Text>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        // TODO - what should do here
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </Flex>
  );
};

export default GoogleLogIn;
