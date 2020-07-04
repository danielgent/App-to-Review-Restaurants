import { Flex, Spinner, Text, Button, useDisclosure } from "@chakra-ui/core";
import React from "react";

import UserContext from "contexts/user-context";
import UploadProfileModal from "components/UploadProfileModal";
import { authAxios } from "utils";
import { Container, Heading } from "components/Styled";
import Avatar from "components/Avatar";

const Profile = (props) => {
  const { user, updateUser } = React.useContext(UserContext);
  const {
    isOpen: uploadProfileModalIsOpen,
    onOpen: onUploadProfileModalOpen,
    onClose: onUploadProfileModalClose,
  } = useDisclosure();

  const refetch = () => {
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/me`)
      .then(function ({ data }) {
        // TODO this is duplicated from UserMe and Login. Want a hook to refresh userData raelly
        updateUser({
          role: data.role,
          avatarFilename: data.avatarFilename,
          username: data.username,
        });
      });
  };

  const handleNewLogo = () => {
    refetch();
    onUploadProfileModalClose();
  };

  return (
    <Container maxWidth={600}>
      <Heading as="h1">Profile</Heading>
      <Text>Your name</Text>
      <Text>{user.name}</Text>
      <Text>Your email</Text>
      <Text>{user.email}</Text>

      <Flex align="center" justify="center">
        {user ? (
          <>
            <Text mr={8}>Current Profile picture</Text>
            <Avatar user={user} />
            <Button onClick={onUploadProfileModalOpen}>
              Upload new profile image
            </Button>
          </>
        ) : (
          <Spinner />
        )}
      </Flex>

      <UploadProfileModal
        isOpen={uploadProfileModalIsOpen}
        onClose={onUploadProfileModalClose}
        onSubmit={handleNewLogo}
      />
    </Container>
  );
};

export default Profile;
