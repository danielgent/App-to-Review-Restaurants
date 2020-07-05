import React from "react";
import { Button, Flex, Text } from "@chakra-ui/core";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      {page > 0 && (
        <Button mr={8} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
      )}
      {page < totalPages - 1 && (
        <Button mr={8} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      )}
      <Text>{`${page + 1} of ${totalPages}`}</Text>
    </Flex>
  );
};

export default Pagination;
