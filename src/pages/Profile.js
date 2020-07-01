import {
  Box,
  Heading,
  Flex,
  Spinner,
  Text,
  Avatar,
  useDisclosure,
  Button,
  Stack,
} from "@chakra-ui/core";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UserContext from "contexts/user-context";
import UploadProfileModal from "components/UploadProfileModal";

const Profile = (props) => {
  const { user } = React.useContext(UserContext);
  const [file, setFile] = React.useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const imageBlob = acceptedFiles[0];
    console.log("imageBlob ", imageBlob);
    setFile(imageBlob);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const {
    isOpen: uploadProfileModalIsOpen,
    onOpen: onUploadProfileModalOpen,
    onClose: onUploadProfileModalClose,
  } = useDisclosure();

  // const handleSubmit = () => {
  //   const data = new FormData();
  //   data.append("document", blob);
  //   axios({
  //     method: "post",
  //     url: "/sample",
  //     data: data,
  //   });
  // };

  // props to odl style
  //   helpText="File Type: .png , .jpeg, .gif. Max size: 2 Mb."
  // accept="image/*"
  // maxSize={2e6}
  // onDropAccepted={handleDropAccepted}
  // onDropRejected={handleDropRejected}
  // error={dropError}
  // multiple={false}
  // styleProps={{ h: { xs: 300, md: 400 } }}

  return (
    <Box>
      <Heading as="h1">Profile</Heading>

      <Flex align="center" justify="center">
        {user ? (
          <>
            <Text mr={8}>Current Profile picture</Text>
            <Avatar name={user.username} mr={4} src={user.avatarImageUrl} />
            <Button onClick={onUploadProfileModalOpen}>
              Upload new profile image
            </Button>
          </>
        ) : (
          <Spinner />
        )}
      </Flex>
      <Box p={10}>
        {!file ? (
          <Flex
            align="center"
            justify="center"
            direction="column"
            h="full"
            border="1px dashed"
            borderColor={isDragReject ? "danger.500" : "primary.500"}
            borderRadius="lg"
            backgroundColor={isDragAccept ? "primary.100" : "#fff"}
            px={10}
            py={60}
            {...getRootProps()}
          >
            {/* {error && (
            <Flex
            color="danger.500"
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            fontSize="sm"
            mb={4}
            >
            <Icon name="warning" size="24px" mb={2} />
            {error}
            </Flex>
          )} */}
            <input
              aria-label="Drag and drop your files here or click to browse files"
              {...getInputProps()}
            />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>
                Drag 'n' drop a new profile picture here, or click to select
              </p>
            )}
          </Flex>
        ) : (
          // TODO - style + info
          <Box>FILE UPLOADED</Box>
        )}
      </Box>
      <UploadProfileModal
        isOpen={uploadProfileModalIsOpen}
        onClose={onUploadProfileModalClose}
      />
    </Box>
  );
};

export default Profile;
