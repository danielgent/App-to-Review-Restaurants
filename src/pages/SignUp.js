import React from "react";
import {
  Box,
  Stack,
  FormErrorMessage,
  Input,
  Select,
  Alert,
  Icon,
  Text,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import isEmail from "validator/es/lib/isEmail";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  SubmitButton,
  Divider,
  FormLabelSubText,
} from "components/Styled";
import { disallowWhitespaceChangeHandler } from "utils";

import GoogleSignUp from "components/GoogleSignUp";
import { ROLES } from "globalConstants";

const SignUp = (props) => {
  const [
    hasSubmittedSuccessfully,
    setHasSubmittedSuccessfully,
  ] = React.useState(false);

  const [serverErrorMessage, setServerErrorMessage] = React.useState("");

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setServerErrorMessage("");

    axios
      .post(`${process.env.REACT_APP_API_URL}/register`, {
        username: values.username,
        name: values.name.trim(),
        email: values.email.trim(),
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
      <Container maxWidth={380}>
        <Heading>Next step</Heading>
        <Box p={4}>
          <Alert
            status="success"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <Icon name="warning" size="32px" color="green.500" />
            <Text mt={4} mb={1} fontSize="lg">
              You have been sent a confirmation email
            </Text>
            <Text maxWidth="sm">Please check your email</Text>
          </Alert>
          <Divider />
        </Box>
      </Container>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        username: "",
        name: "",
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

        if (!values.name) {
          errors.name = "Please enter a name";
        }

        if (!values.email || !isEmail(values.email)) {
          errors.email = "Please enter a valid email";
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
        <Container maxWidth={480}>
          <Heading>Create an account</Heading>
          <Box p={4}>
            <Form>
              <Stack spacing={5}>
                <Field type="text" name="username">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    const { onChange, ...restOfField } = field;
                    return (
                      <FormControl
                        isInvalid={errors.username && touched.username}
                      >
                        <FormLabel htmlFor="username">
                          Enter a username
                          <FormLabelSubText>
                            This will be used to log in
                          </FormLabelSubText>
                        </FormLabel>
                        <Input
                          id="username"
                          type="text"
                          autoComplete="off"
                          onChange={disallowWhitespaceChangeHandler(onChange)}
                          {...restOfField}
                        />
                        <FormErrorMessage>{errors.username}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Field type="text" name="name">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl isInvalid={errors.name && touched.name}>
                        <FormLabel htmlFor="name">
                          Enter a name
                          <FormLabelSubText>
                            This will be displayed publically on the site
                          </FormLabelSubText>
                        </FormLabel>
                        <Input
                          id="name"
                          type="text"
                          autoComplete="off"
                          {...field}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Field type="text" name="email">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl isInvalid={errors.email && touched.email}>
                        <FormLabel htmlFor="email">Email</FormLabel>
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
                      <FormControl>
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
                <SubmitButton type="submit">Create account</SubmitButton>
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
          <Divider />
          <GoogleSignUp />
        </Container>
      )}
    </Formik>
  );
};

export default SignUp;
