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
  // Input,
  // FormErrorMessage,
} from "@chakra-ui/core";
import axios from "axios";
import { useDropzone } from "react-dropzone";

import { getAuthHeader } from "utils";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const [file, setFile] = React.useState(null);
  const toast = useToast();

  const onDrop = React.useCallback((acceptedFiles) => {
    const imageBlob = acceptedFiles[0];
    setFile(imageBlob);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const handleUpload = () => {
    const data = new FormData();
    data.append("avatar", file);
    axios
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
        onClose();
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
              <FormControl
                w={{ xs: "100%", sm: "280px" }}
                // isInvalid={errors.file && touched.file}
              >
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
                        <p>Drop the file here ...</p>
                      ) : (
                        <p>
                          Drag 'n' drop a new profile picture here, or click to
                          select
                        </p>
                      )}
                    </Flex>
                  ) : (
                    // TODO - style + info
                    <Box>FILE UPLOADED</Box>
                  )}
                </Box>
                {/* <FormErrorMessage>{errors.file}</FormErrorMessage> */}
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
