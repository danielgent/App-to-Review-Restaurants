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

const EditUserModal = ({ isOpen, onClose, onSubmit, userId }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          // get these fields
          // comment: values.comment,
          // restaurant: restaurantId,
          // rating: Number.parseInt(values.rating, 10),
          // visitDate: formatDate(values.visitDate),
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
      initialValues={
        {
          // comment: "",
          // rating: "5",
          // visitDate: new Date(),
          // COPY FROM SIGN UP
        }
      }
      validate={(values) => {
        // COPY FROM SIGN UP
        // const errors = {};
        // if (!values.comment) {
        //   errors.comment = "Please enter a comment";
        // }
        // return errors;
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
                    {/* TODO - rest of fields */}
                    <Field type="text" name="comment" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.comment && touched.comment}
                          >
                            <FormLabel htmlFor="comment">Comment</FormLabel>
                            <Input id="comment" type="text" {...field} />
                            <FormErrorMessage>
                              {errors.comment}
                            </FormErrorMessage>
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
                  Create Review
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
