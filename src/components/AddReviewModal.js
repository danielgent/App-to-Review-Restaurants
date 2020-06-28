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
import axios from "axios";
import DatePicker from "react-datepicker";

const formatDate = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const AddReviewModal = ({ isOpen, onClose, onSubmit, restaurantId }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/reviews`, {
        comment: values.comment,
        restaurant: restaurantId,
        rating: Number.parseInt(values.rating, 10),
        visitDate: formatDate(values.visitDate),
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
        comment: "",
        rating: "5",
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
