// candidate for unit test
import React from "react";
import PropTypes from "prop-types";
import { Flex, Icon } from "@chakra-ui/core";

const StarRating = ({ rating }) => {
  const starCount = Math.floor(rating);
  const emptyCount = 5 - starCount;

  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      <>
        {[...Array(starCount)].map((_, idx) => (
          <Icon key={idx} size="24px" name="star" />
        ))}
        {[...Array(emptyCount)].map((_, idx) => (
          <Icon key={idx} size="20px" name="sun" />
        ))}
      </>
    </Flex>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
