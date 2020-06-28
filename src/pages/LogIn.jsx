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
  Divider,
  Alert,
  Icon,
  Text,
} from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useHistory } from "react-router-dom";

import UserContext from "contexts/user-context";

const LogIn = (props) => {
  const [serverErrorMessage, setServerErrorMessage] = React.useState("");
  let history = useHistory();
  const { updateUser } = React.useContext(UserContext);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setServerErrorMessage("");

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      })
      .then(({ data }) => {
        const { token, role } = data;
        updateUser({ token, role });

        // TODO - add token somewhere global here
        history.push("/");
      })
      .catch(function (error) {
        setServerErrorMessage(error.response.data.error);
      });
  };

  return (
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
                <Field type="text" name="password">
                  {({ field, form }) => {
                    const { errors, touched } = form;
                    return (
                      <FormControl
                        w={{ xs: "100%", sm: "280px" }}
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel htmlFor="password">password</FormLabel>
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
                <Button type="submit">Login</Button>
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

export default LogIn;
