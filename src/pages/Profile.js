import {
  Box,
  Heading,
  Flex,
  Spinner,
  Text,
  Avatar,
  Button,
  useDisclosure,
} from "@chakra-ui/core";
import React from "react";
import axios from "axios";

import UserContext from "contexts/user-context";
import UploadProfileModal from "components/UploadProfileModal";
import { getAuthHeader } from "utils";

const Profile = (props) => {
  const { user, updateUser } = React.useContext(UserContext);
  const {
    isOpen: uploadProfileModalIsOpen,
    onOpen: onUploadProfileModalOpen,
    onClose: onUploadProfileModalClose,
  } = useDisclosure();

  const makeAvatarImageUrl = (avatarFilename) =>
    `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

  const refetch = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/me`, {
        headers: getAuthHeader(),
      })
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
    <Box p={10}>
      <Heading as="h1">Profile</Heading>

      <Flex align="center" justify="center">
        {user ? (
          <>
            <Text mr={8}>Current Profile picture</Text>
            <Avatar
              name={user.username}
              mr={4}
              src={makeAvatarImageUrl(user.avatarFilename)}
            />
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
    </Box>
  );
};

export default Profile;
