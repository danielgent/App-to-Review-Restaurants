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

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/reviews`, {
        name: values.name,
        // TODO - correct fields
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
        // TODO - correct fields

        name: "",
      }}
      validate={(values) => {
        const errors = {};
        // TODO - correct fields

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
              <ModalHeader>Create new Review</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    {/* // TODO - correct fields */}
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

export default AddReviewModal;
