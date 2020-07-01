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

  // props to odl style
  //   helpText="File Type: .png , .jpeg, .gif. Max size: 2 Mb."
  // accept="image/*"
  // maxSize={2e6}
  // onDropAccepted={handleDropAccepted}
  // onDropRejected={handleDropRejected}
  // error={dropError}
  // multiple={false}
  // styleProps={{ h: { xs: 300, md: 400 } }}

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
