import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Flex,
  useToast,
  Text,
  Alert,
  Icon,
} from "@chakra-ui/core";
import { useDropzone } from "react-dropzone";

import { getAuthHeader, authAxios } from "utils";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState(null);
  const toast = useToast();

  const onDropAccepted = (acceptedFiles) => {
    const imageBlob = acceptedFiles[0];
    setFile(imageBlob);
    setError();
  };

  const onDropRejected = (rejectedFiles) => {
    setError("Please check uploaded images and try again");
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    onDropAccepted,
    onDropRejected,
    multiple: false,
    maxSize: 1e6,
  });
  // onDropRejected={handleDropRejected}
  // error={dropError}

  const handleUpload = () => {
    const data = new FormData();
    data.append("avatar", file);
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/users/profile`, data, {
        headers: getAuthHeader(),
      })
      .then(function (response) {
        setFile();
        toast({
          description: "New profile pic uploaded",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onSubmit();
      })
      .catch(function (error) {
        // here output to somewhere!
        console.log(error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Upload new profile image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4}>
            <Stack spacing={5}>
              <FormControl>
                <FormLabel htmlFor="file">Upload file</FormLabel>
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
                      <input
                        aria-label="Drag and drop your files here or click to browse files"
                        {...getInputProps()}
                      />
                      {isDragActive ? (
                        <Text>Drop the file here ...</Text>
                      ) : (
                        <>
                          <Text>
                            Drag 'n' drop a new profile picture here, or click
                            to select
                          </Text>
                          <Text fontSize="xs">Max image size is 1mb</Text>
                        </>
                      )}
                    </Flex>
                  ) : (
                    <Flex align="center" justify="center" direction="column">
                      <Text fontSize="lg" mb={6}>
                        File Uploaded
                      </Text>
                      <Text fontStyle="italic">{file.name}</Text>
                      <Button variant="ghost" onClick={() => setFile()}>
                        Clear
                      </Button>
                    </Flex>
                  )}
                  {error && (
                    <Alert
                      status="error"
                      flexDirection="column"
                      justifyContent="center"
                      textAlign="center"
                      height="200px"
                    >
                      <Icon name="warning" size="32px" color="red.500" />
                      <Text maxWidth="sm">{error}</Text>
                    </Alert>
                  )}
                </Box>
              </FormControl>
            </Stack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variantColor="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {file && (
            <Button variant="ghost" onClick={handleUpload}>
              Upload image
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadProfileModal;
