import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Spinner, Flex, Box, Heading, Text } from "@chakra-ui/core";
import axios from "axios";

import { getAuthHeader } from "utils";

const Verify = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  let { push } = useHistory();

  let { code } = useParams();

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/verify/${code}`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        window.setTimeout(push, 2 * 1000, "/login");
        setIsLoading(false);
      });

    setIsLoading(false);
  }, [push, code]);

  if (isLoading) {
    return (
      <Box p={16}>
        <Flex alignItems="center" alignContent="center">
          <Spinner />
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={16}>
      <Flex alignItems="center" alignContent="center">
        <Heading>Email verified</Heading>
        <Text>Redirecting to Login page</Text>
      </Flex>
    </Box>
  );
};

export default Verify;
