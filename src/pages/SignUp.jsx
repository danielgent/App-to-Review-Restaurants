import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/core";

const SignUp = (props) => {
  const errors = {},
    touched = {};
  return (
    <Box>
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
        </Stack>
      </form>
    </Box>
  );
};

SignUp.propTypes = {};

export default SignUp;
