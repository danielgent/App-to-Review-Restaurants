import React from "react";
import { Text, Flex, Box, Button } from "@chakra-ui/core";

import StaticRating from "components/StaticRating";

const RatingButton = ({ value, highlighted, ...restOfProps }) => (
  <Button
    border={highlighted && "solid"}
    d="block"
    variant="ghost"
    {...restOfProps}
    mb={4}
  >
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      <StaticRating value={value} size="small" />
      <Text ml={2}>{"& Up"}</Text>
    </Flex>
  </Button>
);

const Filters = ({ onChange, value, ...rest }) => {
  return (
    <Box {...rest}>
      <Text fontWeight="bold">Avg. Customer Review</Text>
      {[...Array(6)]
        .map((_, idx) => idx)
        .reverse()
        .map((idx) =>
          idx === 0 ? (
            <Button key={idx} variant="ghost" onClick={() => onChange(null)}>
              &amp; unrated
            </Button>
          ) : (
            <RatingButton
              highlighted={value === idx}
              value={idx}
              onClick={() => onChange(idx)}
              key={idx}
            />
          )
        )}
    </Box>
  );
};

export default Filters;
