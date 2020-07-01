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
  // Input,
  // FormErrorMessage,
} from "@chakra-ui/core";
// import axios from "axios";
import { useDropzone } from "react-dropzone";

// import { getAuthHeader } from "utils";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const [file, setFile] = React.useState(null);

  const onDrop = React.useCallback((acceptedFiles) => {
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

  // const handleSubmit = (values, { setSubmitting, resetForm }) => {
  //   const data = new FormData();
  //   data.append("avatar", values.file);
  //   axios({
  //     method: "post",
  //     url: "/sample",
  //     data: data,
  //   });

  //   axios
  //     .post(`${process.env.REACT_APP_API_URL}/profile`, data, {
  //       headers: getAuthHeader(),
  //     })
  //     .then(function (response) {
  //       onSubmit();
  //     })
  //     .catch(function (error) {
  //       // here output to somewhere!
  //       console.log(error);
  //     });
  // };

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
                {/* TODO - replace with file input dnd */}

                {/* <Input id="file" type="textarea" {...field} /> */}
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
          <Button variantColor="blue" type="button" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" type="submit">
            Upload image
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadProfileModal;
