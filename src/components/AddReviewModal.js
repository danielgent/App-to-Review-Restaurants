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

const AddReviewModal = ({ isOpen, onClose, onSubmit, restaurantId }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/reviews`, {
        comment: values.comment,
        restaurant: restaurantId,
        // TODO -use NumberInput from Chakra
        rating: Number.parseInt(values.rating, 10),
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
        comment: "",
        rating: "",
      }}
      validate={(values) => {
        const errors = {};
        // TODO - correct fields

        if (!values.comment) {
          errors.comment = "Please enter a comment";
        }
        if (!values.rating) {
          errors.rating = "Please rate";
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
              <ModalHeader>Rate this restaurant</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
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
                    <Field type="text" name="rating" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.rating && touched.rating}
                          >
                            <FormLabel htmlFor="rating">Rating</FormLabel>
                            <Input id="rating" type="text" {...field} />
                            <FormErrorMessage>{errors.rating}</FormErrorMessage>
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
