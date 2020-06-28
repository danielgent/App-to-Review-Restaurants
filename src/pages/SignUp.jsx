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
  Select,
  Divider,
  Alert,
  Icon,
  Text,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";

import { ROLES } from "globalConstants";

const SignUp = (props) => {
  const [
    hasSubmittedSuccessfully,
    setHasSubmittedSuccessfully,
  ] = React.useState(false);
  // new idea for server side errors
  const [serverErrorMessage, setServerErrorMessage] = React.useState("");

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setServerErrorMessage("");

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      })
      .then(function (response) {
        setHasSubmittedSuccessfully(true);
      })
      .catch(function (error) {
        setServerErrorMessage(error.response.data.error);
      });
  };

  if (hasSubmittedSuccessfully) {
    return (
      <Box>
        <Heading>Next step</Heading>
        <Box p={4}>
          <Alert
            status="success"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <Icon name="warning" size="32px" color="red.500" />
            <Text mt={4} mb={1} fontSize="lg">
              You have been sent a confirmation email
            </Text>
            <Text maxWidth="sm">Please check your email</Text>
          </Alert>
          <Divider />
        </Box>
      </Box>
    );
  }

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

        if (!values.username) {
          errors.username = "Please enter a username";
        }
        if (!values.email) {
          errors.email = "Please enter an email";
        }
        if (!values.password) {
          errors.password = "Please enter a password";
        }
        if (values.repeatPassword !== values.password) {
          errors.repeatPassword = "Passwords must match";
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
                        <FormLabel htmlFor="username">Enter a username</FormLabel>
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
                        <FormLabel htmlFor="password">Enter password</FormLabel>
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
                          Repeat password
                        </FormLabel>
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
                <Divider />
                <Button type="submit">Create account</Button>
              </Stack>
            </Form>
          </Box>
          {serverErrorMessage && (
            <Alert
              status="error"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <Icon name="warning" size="32px" color="red.500" />
              <Text maxWidth="sm">{serverErrorMessage}</Text>
            </Alert>
          )}
        </Box>
      )}
    </Formik>
  );
};

SignUp.propTypes = {};

export default SignUp;
