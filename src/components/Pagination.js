import React from "react";
import { Button, Flex, Text } from "@chakra-ui/core";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <Flex>
      {page > 0 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
      {page < totalPages - 1 && (
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      )}
      <Text>{`${page + 1} of ${totalPages}`}</Text>
    </Flex>
  );
};

export default Pagination;
