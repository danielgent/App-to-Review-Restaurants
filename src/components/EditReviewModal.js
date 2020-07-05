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
  Select,
  FormErrorMessage,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";

import DatePicker from "components/DatePicker";

import {
  authAxios,
  convertDateObjectToIsoString,
  convertIsoStringToDateObject,
} from "utils";

const EditReviewModal = ({ isOpen, onClose, onSubmit, review }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .patch(`${process.env.REACT_APP_API_URL}/reviews/${review._id}`, {
        comment: values.comment,
        rating: Number.parseInt(values.rating, 10),
        visitDate: convertDateObjectToIsoString(values.visitDate),
        reply: values.reply,
      })
      .then(function (response) {
        onSubmit();
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        comment: review?.comment,
        rating: review?.rating,
        visitDate: review?.visitDate
          ? convertIsoStringToDateObject(review.visitDate)
          : new Date(),
        reply: review?.reply,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.comment) {
          errors.comment = "Please enter a comment";
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
              <ModalHeader>Edit this review</ModalHeader>
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
                        return (
                          <FormControl
                            isInvalid={errors.rating && touched.rating}
                          >
                            <FormLabel htmlFor="rating">Rating</FormLabel>
                            {/* TODO - user Rating component from Material UI */}
                            <Select id="rating" {...field}>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </Select>
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
                    <Field type="text" name="reply" autoComplete="off">
                      {({ field }) => {
                        return (
                          <FormControl>
                            <FormLabel htmlFor="reply">Reply</FormLabel>
                            <Input id="reply" type="text" {...field} />
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
                  Update Review
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default EditReviewModal;
