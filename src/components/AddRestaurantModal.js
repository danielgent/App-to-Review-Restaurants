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
  Input,
  FormErrorMessage,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";

import { authAxios } from "utils";
import Dropzone from "components/Dropzone";
import {
  FormControl,
  FormLabel,
  SubmitButton,
  FormLabelSubText,
} from "components/Styled";

const AddRestaurantModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("profileImage", values.profileImage);
    data.append("galleryImage", values.galleryImage);

    authAxios
      .post(`${process.env.REACT_APP_API_URL}/restaurants`, data)
      .then(function (response) {
        onSubmit();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: "",
        profileImage: null,
        galleryImage: null,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Please enter a name";
        }

        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <Form>
              <ModalHeader>Create new restaurant</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    <Field type="text" name="name" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl isInvalid={errors.name && touched.name}>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input id="name" type="text" {...field} />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Field type="text" name="profileImage" autoComplete="off">
                      {({ field, form }) => {
                        const { value, onChange } = field;
                        const handleChange = (imageBlob) =>
                          onChange({
                            target: { name: "profileImage", value: imageBlob },
                          });
                        return (
                          <FormControl>
                            <FormLabel htmlFor="profileImage">
                              Profile image
                              <FormLabelSubText>
                                This will be shown in a list
                              </FormLabelSubText>
                            </FormLabel>
                            <Dropzone
                              onDropAccepted={(imageBlob) =>
                                handleChange(imageBlob)
                              }
                              file={value}
                              setFile={handleChange}
                            />
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Field type="text" name="galleryImage" autoComplete="off">
                      {({ field, form }) => {
                        const { value, onChange } = field;
                        const handleChange = (imageBlob) =>
                          onChange({
                            target: { name: "galleryImage", value: imageBlob },
                          });
                        return (
                          <FormControl>
                            <FormLabel htmlFor="galleryImage">
                              Gallery Image
                              <FormLabelSubText>
                                Main image shown on the detail page
                              </FormLabelSubText>
                            </FormLabel>
                            <Dropzone
                              onDropAccepted={(imageBlob) =>
                                handleChange(imageBlob)
                              }
                              file={value}
                              setFile={handleChange}
                            />
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
                <SubmitButton type="submit">Create restaurant</SubmitButton>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default AddRestaurantModal;
