import React from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/core";

import { getAuthHeader } from "utils";

const TableCell = (props) => (
  <Box
    borderColor="gray.600"
    borderWidth="1px"
    borderStyle="solid"
    borderTop="none"
    borderLeft="none"
    p={4}
    {...props}
  />
);

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

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
    <Box p={4}>
      <Heading>View users</Heading>
      <SimpleGrid
        columns={5}
        borderColor="gray.600"
        borderWidth="1px"
        borderStyle="solid"
        borderRight="none"
        borderBottom="none"
      >
        <TableCell>
          <HeaderText>Username</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Email</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Role</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>AvatarFilename</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Login Attempts</HeaderText>
        </TableCell>
        {users.map((user) => (
          <>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.avatarFilename}</TableCell>
            <TableCell>{user.loginAttempts}</TableCell>
          </>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ViewUsers;
