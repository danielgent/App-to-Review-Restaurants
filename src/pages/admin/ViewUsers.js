import React from "react";
import { CircularProgress, Text, useToast, Button } from "@chakra-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import EditUserModal from "components/EditUserModal";
import ConfirmationModal from "components/ConfirmationModal";
import { Container, Heading } from "components/Styled";
import { authAxios } from "utils";

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

const ViewUsers = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [userToEdit, setUserToEdit] = React.useState(null);
  const [userToDelete, setUserToDelete] = React.useState(null);

  const toast = useToast();

  const fetchUsers = () => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/users`)
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
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/users/unlock/${userId}`, {})
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
  const handleDeleteUser = () => {
    authAxios
      .delete(`${process.env.REACT_APP_API_URL}/users/${userToDelete._id}`)
      .then(function (response) {
        toast({
          description: "User succesfully deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setUserToDelete();
        fetchUsers();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={1200}>
      <Heading>View users</Heading>
      <Table>
        <TableHead>
          <TableCell>
            <HeaderText>Username</HeaderText>
          </TableCell>
          <TableCell>
            <HeaderText>Name</HeaderText>
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
          <TableCell />
          <TableCell />
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.username}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.avatarFilename}</TableCell>
              {user.loginAttempts < 3 ? (
                <TableCell>{user.loginAttempts}</TableCell>
              ) : (
                <TableCell p={2}>
                  <Button size="sm" onClick={() => handleUnlockUser(user._id)}>
                    Unlock
                  </Button>
                </TableCell>
              )}
              <TableCell p={2}>
                <Button size="sm" onClick={() => setUserToEdit(user)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell p={2}>
                <Button size="sm" onClick={() => setUserToDelete(user)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditUserModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        onSubmit={handleUpdateUser}
        user={userToEdit}
      />
      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      >
        Are you sure you want to delete this user {userToDelete?.username}? Will
        also delete all user's restaurants and reviews
      </ConfirmationModal>
    </Container>
  );
};

export default ViewUsers;
