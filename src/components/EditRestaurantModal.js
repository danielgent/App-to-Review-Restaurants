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

import { getAuthHeader, authAxios } from "utils";

const EditRestaurantModal = ({
  isOpen,
  onClose,
  onSubmit,
  restaurant = {},
}) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .patch(
        `${process.env.REACT_APP_API_URL}/restaurants/${restaurant._id}`,
        {
          name: values.name,
        },

        {
          headers: getAuthHeader(),
        }
      )
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
        name: restaurant?.name,
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
              <ModalHeader>Edit restaurant</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    <Field type="text" name="name" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.name && touched.name}
                          >
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
                  Update restaurant
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default EditRestaurantModal;
