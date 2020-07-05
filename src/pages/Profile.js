import {
  Flex,
  Spinner,
  SimpleGrid,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/core";
import React from "react";

import UserContext from "contexts/user-context";
import UploadProfileModal from "components/UploadProfileModal";
import { authAxios } from "utils";
import { Container, Heading } from "components/Styled";
import Avatar from "components/Avatar";

const Label = (props) => <Text d="b" p={4} fontWeight="bold" {...props} />;
const Value = (props) => <Text d="b" p={4} fontStyle="italic" {...props} />;

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
        // TODO this is duplicated from UserMe and Login. Want a hook to refresh userData really
        updateUser({
          role: data.role,
          avatarFilename: data.avatarFilename,
          username: data.username,
          name: data.name,
          email: data.email,
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
      <SimpleGrid columns={2} mb={6}>
        <Label>Your name</Label>
        <Value>{user.name}</Value>
        <Label>Your email</Label>
        <Value>{user.email}</Value>
      </SimpleGrid>

      <Flex
        align="center"
        justify="center"
        p={4}
        border="solid"
        rounded="lg"
        flexDirection={{ xs: "column", md: "row" }}
      >
        {user ? (
          <>
            <Label mr={8}>Current Profile picture</Label>
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
