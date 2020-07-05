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
import Rating from "@material-ui/lab/Rating";

import { FormControl, FormLabel } from "components/Styled";
import { authAxios, convertDateObjectToIsoString } from "utils";
import DatePicker from "components/DatePicker";

const AddReviewModal = ({ isOpen, onClose, onSubmit, restaurantId }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/reviews`, {
        comment: values.comment,
        restaurant: restaurantId,
        rating: Number.parseInt(values.rating, 10),
        visitDate: convertDateObjectToIsoString(values.visitDate),
      })
      .then(function (response) {
        onSubmit();
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        comment: "",
        rating: null,
        visitDate: new Date(),
      }}
      validate={(values) => {
        const errors = {};
        if (!values.comment) {
          errors.comment = "Please enter a comment";
        }
        if (!values.rating) {
          errors.rating = "Please enter a rating";
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
                        const { onChange, name, ...rest } = field;
                        const handleChange = (e, value) => {
                          onChange({
                            target: { value, name },
                          });
                        };
                        return (
                          <FormControl
                            isInvalid={errors.rating && touched.rating}
                          >
                            <FormLabel htmlFor="rating">Rating</FormLabel>
                            <Rating
                              id="rating"
                              size="large"
                              onChange={handleChange}
                              name={name}
                              {...rest}
                            />
                            <FormErrorMessage>{errors.rating}</FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                    <Field type="text" name="visitDate" autoComplete="off">
                      {({ field, form }) => {
                        const { value, onChange } = field;
                        const handleChange = (date) => {
                          onChange({
                            target: {
                              name: "visitDate",
                              value: date,
                            },
                          });
                        };
                        return (
                          <FormControl>
                            <FormLabel htmlFor="visitDate">
                              Date of visit
                            </FormLabel>
                            <DatePicker
                              id="visitDate"
                              selected={value}
                              onChange={handleChange}
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
