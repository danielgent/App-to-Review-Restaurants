import React from "react";
import { Text, Box, Button } from "@chakra-ui/core";

import StaticRating from "components/StaticRating";

const RatingButton = ({ value, highlighted, ...restOfProps }) => (
  <Button
    data-testid={`rating-${value}`}
    mr={2}
    mb={2}
    variantColor={"teal"}
    variant={highlighted ? "solid" : "outline"}
    {...restOfProps}
  >
    <StaticRating value={value} size="small" />
  </Button>
);

const Filters = ({ onChange, value, ...rest }) => {
  return (
    <Box {...rest}>
      <Text fontWeight="bold" mb={4}>
        Minimum Avg. <br /> Customer Review
      </Text>
      {[...Array(6)]
        .map((_, idx) => idx)
        .reverse()
        .map((idx) =>
          idx === 0 ? (
            <Button
              display="block"
              key={idx}
              variantColor={"teal"}
              variant={value === null ? "solid" : "outline"}
              onClick={() => onChange(null)}
            >
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
