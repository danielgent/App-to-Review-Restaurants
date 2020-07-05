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

import { authAxios } from "utils";

const AddRestaurantModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/restaurants`, {
        name: values.name,
      })
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
                  Create restaurant
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default AddRestaurantModal;
