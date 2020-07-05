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
  useToast,
} from "@chakra-ui/core";

import { authAxios } from "utils";
import Dropzone from "components/Dropzone";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const [file, setFile] = React.useState(null);
  const toast = useToast();

  const handleUpload = () => {
    const data = new FormData();
    data.append("avatar", file);
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/users/profile`, data)
      .then(function (response) {
        setFile();
        toast({
          description: "New profile pic uploaded",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onSubmit();
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
                <Dropzone
                  onDropAccepted={(imageBlob) => setFile(imageBlob)}
                  file={file}
                  setFile={setFile}
                />
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
