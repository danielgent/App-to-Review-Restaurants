import React from "react";
import {
  Box,
  Stack,
  FormErrorMessage,
  Input,
  Alert,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import UserContext from "contexts/user-context";
import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  SubmitButton,
  Divider,
  StyledLink,
} from "components/Styled";
import GoogleLogIn from "components/GoogleLogIn";
import { disallowWhitespaceChangeHandler } from "utils";

const LogIn = (props) => {
  const [serverErrorMessage, setServerErrorMessage] = React.useState("");

  const invalidToken = window.location.search.includes("invalid_token");

  let history = useHistory();
  const { updateUser } = React.useContext(UserContext);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setServerErrorMessage("");

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        username: values.username,
        password: values.password,
      })
      .then(({ data }) => {
        const { token, role } = data;
        updateUser({ token, role });

        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

        history.push("/");
      })
      .catch(function (error) {
        setServerErrorMessage(error.response.data.error);
      });
  };

  return (
    <Container maxWidth={380}>
      {/* TODO - first round where Axios doesn't have access to React-router history */}
      {invalidToken && (
        <Text p={12} fontSize="lg">
          Token expired. Please login again
        </Text>
      )}

      <Formik
        enableReinitialize
        initialValues={{
          username: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.username) {
            errors.username = "Please enter a username";
          }
          if (!values.password) {
            errors.password = "Please enter a password";
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Box>
            <Heading>Login</Heading>
            <Divider />
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
                        <FormLabel htmlFor="username">Username</FormLabel>
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
                <Field type="text" name="password">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
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
                <Divider />
                <SubmitButton>Login</SubmitButton>
              </Stack>
            </Form>
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
            <GoogleLogIn />
            <Divider />
            <Flex justifyContent="center" alignItems="center">
              <Link to="/sign-up">
                <StyledLink>Create an account</StyledLink>
              </Link>
            </Flex>
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default LogIn;
