// TODO -change all pages to .js so autoformat save works.
import React from "react";
import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";

import { ROLES } from "globalConstants";

const SignUp = (props) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("handleSubmit");
    // axios
    //   .post(`${process.env.REACT_APP_API_URL}/reviews`, {
    //     comment: values.comment,
    //     restaurant: restaurantId,
    //     // TODO -use NumberInput from Chakra
    //     rating: Number.parseInt(values.rating, 10),
    //   })
    //   .then(function (response) {
    //     onSubmit();
    //   })
    //   .catch(function (error) {
    //     // here output to somewhere!
    //     console.log(error);
    //   });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: ROLES.user,
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
        <Box>
          <Heading>Sign up create account</Heading>
          <Box p={4}>
            <Form>
              <Stack spacing={5}>
                <Field type="text" name="username">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl
                        w={{ xs: "100%", sm: "280px" }}
                        isInvalid={errors.username && touched.username}
                      >
                        <FormLabel htmlFor="username">username</FormLabel>
                        <Input
                          id="username"
                          type="text"
                          autoComplete="off"
                          {...field}
                        />
                        <FormErrorMessage>{errors.username}</FormErrorMessage>
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
                        {/* TODO - how to do easy email input? */}
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
                <Field type="text" name="password">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl
                        w={{ xs: "100%", sm: "280px" }}
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel htmlFor="password">password</FormLabel>
                        {/* TODO - how to do easy password input? */}
                        <Input
                          id="password"
                          type="password"
                          autoComplete="off"
                          {...field}
                        />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Field type="text" name="repeatPassword">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl
                        w={{ xs: "100%", sm: "280px" }}
                        isInvalid={
                          errors.repeatPassword && touched.repeatPassword
                        }
                      >
                        <FormLabel htmlFor="repeatPassword">
                          repeatPassword
                        </FormLabel>
                        {/* TODO - how to do easy repeatPassword input? */}
                        <Input
                          id="repeatPassword"
                          type="password"
                          autoComplete="off"
                          {...field}
                        />
                        <FormErrorMessage>
                          {errors.repeatPassword}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button>Create account</Button>
              </Stack>
            </Form>
          </Box>
        </Box>
      )}
    </Formik>
  );
};

SignUp.propTypes = {};

export default SignUp;
