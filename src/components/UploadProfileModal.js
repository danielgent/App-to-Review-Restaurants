import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";

import { getAuthHeader } from "utils";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = new FormData();
    data.append("avatar", values.file);
    axios({
      method: "post",
      url: "/sample",
      data: data,
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/profile`, data, {
        headers: getAuthHeader(),
      })
      .then(function (response) {
        onSubmit();
      })
      .catch(function (error) {
        // here output to somewhere!
        console.log(error);
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        file: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.file) {
          errors.file = "Please select a file";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <Form>
              <ModalHeader>Upload new profile image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    <Field type="text" name="file" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.file && touched.file}
                          >
                            <FormLabel htmlFor="file">Upload file</FormLabel>
                            {/* TODO - replace with file input dnd */}
                            <Input id="file" type="textarea" {...field} />
                            <FormErrorMessage>{errors.file}</FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                  </Stack>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button
                  variantColor="blue"
                  type="button"
                  mr={3}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button variant="ghost" type="submit">
                  Upload image
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default UploadProfileModal;
