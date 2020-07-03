import React from "react";
import {
  Box,
  Heading as RHeading,
  FormControl as RFormControl,
  FormLabel as RFormLabel,
  Button,
  Divider as RDivider,
  Text,
} from "@chakra-ui/core";

export const Container = (props) => (
  <Box backgroundColor="white" rounded="md" w="100%" py={8} px={4} {...props} />
);

export const Heading = (props) => <RHeading mb={10} {...props} />;

export const FormControl = (props) => <RFormControl mb={4} {...props} />;

export const FormLabel = (props) => (
  <RFormLabel mb={4} fontWeight="bold" {...props} />
);

export const SubmitButton = (props) => (
  <Button type="submit" textTransform="uppercase" {...props} py={6} px={4} />
);

export const Divider = (props) => <RDivider mb={8} {...props} />;
export const StyledLink = (props) => (
  <Text textDecoration="underline" {...props} />
);

export const TableCell = (props) => (
  <Box
    borderColor="gray.600"
    borderWidth="1px"
    borderStyle="solid"
    borderTop="none"
    borderLeft="none"
    p={4}
    {...props}
  />
);
