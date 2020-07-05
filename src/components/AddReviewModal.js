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
import DatePicker from "react-datepicker";
import Rating from "@material-ui/lab/Rating";

import { authAxios } from "utils";
import { FormControl, FormLabel } from "components/Styled";

const formatDate = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const AddReviewModal = ({ isOpen, onClose, onSubmit, restaurantId }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .post(`${process.env.REACT_APP_API_URL}/reviews`, {
        comment: values.comment,
        restaurant: restaurantId,
        rating: Number.parseInt(values.rating, 10),
        visitDate: formatDate(values.visitDate),
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
        rating: 0,
        visitDate: new Date(),
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
                            {/* TODO - why turning into string on onChange? Still works but propType warning */}
                            <Rating id="rating" size="large" {...field} />
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
                          <FormControl w={{ xs: "100%", sm: "280px" }}>
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
