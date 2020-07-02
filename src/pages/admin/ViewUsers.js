import React from "react";
import axios from "axios";
import { Box, CircularProgress, Heading } from "@chakra-ui/core";

import { getAuthHeader } from "utils";

const ViewUsers = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        setUsers(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Box>
      <Heading>View users</Heading>
      {JSON.stringify(users, null, 2)}
    </Box>
  );
};

export default ViewUsers;
