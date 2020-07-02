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
  Select,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import isEmail from "validator/es/lib/isEmail";

import { getAuthHeader } from "utils";
import { ROLES } from "globalConstants";

const EditUserModal = ({ isOpen, onClose, onSubmit, user = {} }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/users/${user._id}`,
        {
          username: values.username,
          email: values.email,
          role: values.role,
        },
        {
          headers: getAuthHeader(),
        }
      )
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
        username: user?.username || "",
        email: user?.email || "",
        role: user?.role || ROLES.user,
      }}
      validate={(values) => {
        const errors = {};

        if (!values.username) {
          errors.username = "Please enter a username";
        }
        if (!values.email || !isEmail(values.email)) {
          errors.email = "Please enter a valid email";
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
              <ModalHeader>Edit User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    <Field type="text" name="username">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.username && touched.username}
                          >
                            <FormLabel htmlFor="username">
                              Enter a username
                            </FormLabel>
                            <Input
                              id="username"
                              type="text"
                              autoComplete="off"
                              {...field}
                            />
                            <FormErrorMessage>
                              {errors.username}
                            </FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Field type="text" name="email">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.email && touched.email}
                          >
                            <FormLabel htmlFor="email">email</FormLabel>
                            <Input
                              id="email"
                              type="text"
                              autoComplete="off"
                              {...field}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Field type="text" name="role">
                      {({ field, form }) => {
                        return (
                          <FormControl w={{ xs: "100%", sm: "280px" }}>
                            <FormLabel htmlFor="role">Select role</FormLabel>
                            <Select id="role" {...field}>
                              <option value={ROLES.user}>User</option>
                              <option value={ROLES.owner}>Owner</option>
                            </Select>
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
                  Update User
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default EditUserModal;