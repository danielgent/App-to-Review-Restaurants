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
import UserContext from "contexts/user-context";
import UploadProfileModal from "components/UploadProfileModal";

const Profile = (props) => {
  const { user } = React.useContext(UserContext);
  const {
    isOpen: uploadProfileModalIsOpen,
    onOpen: onUploadProfileModalOpen,
    onClose: onUploadProfileModalClose,
  } = useDisclosure();

  const makeAvatarImageUrl = (avatarFilename) =>
    `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

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
      />
    </Box>
  );
};

export default Profile;
