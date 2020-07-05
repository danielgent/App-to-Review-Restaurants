import React from "react";
import { CircularProgress, Flex } from "@chakra-ui/core";

const GlobalLoading = (props) => {
  return (
    <Flex h="400px" alignItems="center" justifyContent="center" {...props}>
      <CircularProgress isIndeterminate color="green"></CircularProgress>
    </Flex>
  );
};

export default GlobalLoading;
