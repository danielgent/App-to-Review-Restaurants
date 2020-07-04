import React from "react";
import {
  Button,
  Modal,
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

const AddReplyModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewId,
  handleSubmitReply,
}) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    authAxios
      .post(
        `${process.env.REACT_APP_API_URL}/reviews/${reviewId}/reply`,
        {
          reply: values.reply,
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
        reply: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.reply) {
          errors.reply = "Please reply";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <Form>
              <ModalHeader>Reply to review</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box p={4}>
                  <Stack spacing={5}>
                    {/* TODO - show review here in quote box */}
                    <Field type="text" name="reply" autoComplete="off">
                      {({ field, form }) => {
                        const { errors, touched } = form;
                        return (
                          <FormControl
                            w={{ xs: "100%", sm: "280px" }}
                            isInvalid={errors.reply && touched.reply}
                          >
                            <FormLabel htmlFor="reply">Reply</FormLabel>
                            {/* NOTE - text area.  Then need to change display to format new lines */}
                            <Input id="reply" type="textarea" {...field} />
                            <FormErrorMessage>{errors.reply}</FormErrorMessage>
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
                  Reply
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Formik>
  );
};

export default AddReplyModal;
