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
  Icon,
  Avatar,
  Alert,
  Divider,
  Text,
  Flex,
} from "@chakra-ui/core";

const SignUp = (props) => {
  const errors = {},
    touched = {};
  return (
    <Box>
      <Heading>Sign up create account</Heading>
      <Box p={4}>
        <form>
          <Stack spacing={5}>
            <FormControl
              w={{ xs: "100%", sm: "280px" }}
              isInvalid={errors.email && touched.email}
            >
              <FormLabel htmlFor="signup-email">Your email:</FormLabel>
              <Input
                name="email"
                id="signup-email"
                placeholder="email address"
                type="email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl w={{ xs: "100%", sm: "280px" }}>
              <FormLabel htmlFor="signup-password">
                Create your password:
              </FormLabel>
              <Input
                name="password"
                id="signup-password"
                type="password"
                placeholder="password"
              />
            </FormControl>
            <Button>Create account</Button>
            <Flex flexDirection="row">
              <Text fontStyle="italic">
                TODO: eventually need file upload to do this
              </Text>
              <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            </Flex>
            <Alert status="info">
              <Icon name="warning" size="32px" color="red.500" />
              You will be sent a confirmation email
            </Alert>
            <Divider />
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <Icon name="warning" size="32px" color="red.500" />
              <Text mt={4} mb={1} fontSize="lg">
                Application submitted!
              </Text>
              <Text maxWidth="sm">
                Thanks for submitting your application. Our team will get back
                to you soon.
              </Text>
            </Alert>
            <Divider />
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

SignUp.propTypes = {};

export default SignUp;
