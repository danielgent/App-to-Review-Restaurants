import React from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Heading,
  SimpleGrid,
  Text,
  useToast,
  Button,
} from "@chakra-ui/core";

import { getAuthHeader } from "utils";
import EditUserModal from "components/EditUserModal";

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
  const [userToEdit, setUserToEdit] = React.useState(null);

  const toast = useToast();

  const fetchUsers = () => {
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
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnlockUser = async (userId) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/unlock/${userId}`,
        {},
        {
          headers: getAuthHeader(),
        }
      )
      .then(function (response) {
        toast({
          description: "User unlocked",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchUsers();
      })
      .catch(function (error) {
        // here output to somewhere!
        console.log(error);
      });
  };

  const handleUpdateUser = () => {
    fetchUsers();
    setUserToEdit(null);
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Box p={4}>
      <Heading>View users</Heading>
      <SimpleGrid
        columns={6}
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
        <TableCell>
          <HeaderText>Edit</HeaderText>
        </TableCell>
        {users.map((user) => (
          <React.Fragment key={user.username}>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.avatarFilename}</TableCell>
            {user.loginAttempts < 3 ? (
              <TableCell>{user.loginAttempts}</TableCell>
            ) : (
              <TableCell p={2}>
                <Button onClick={() => handleUnlockUser(user._id)}>
                  Unlock user
                </Button>
              </TableCell>
            )}
            <TableCell p={2}>
              <Button onClick={() => setUserToEdit(user)}>Edit user</Button>
            </TableCell>
          </React.Fragment>
        ))}
      </SimpleGrid>
      <EditUserModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        onSubmit={handleUpdateUser}
        user={userToEdit}
      />
    </Box>
  );
};

export default ViewUsers;
