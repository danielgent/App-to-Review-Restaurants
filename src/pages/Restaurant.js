import React from "react";
import { Box, Heading, Text } from "@chakra-ui/core";
import { useParams } from "react-router-dom";

// doing joins on FE for now. Read up on this a bit
import restaurants from "fixtures/restaurants";
// import reviews from "fixtures/reviews";
// import users from "fixtures/users";
// 1. get working quickest way. 2. optimise later. will be small project. do hardest parts first
// remmeber that totally failed last time in obvious ways

const Restaurant = () => {
  let { id } = useParams();

  // FAKE BE BIT
  const { name, averageRating, highReview, lowReview } = restaurants.find(
    (r) => r.id === id
  );

  return (
    <Box p={4}>
      <Heading>{name}</Heading>
      <Text>Avg {averageRating}</Text>
      {/* TODO - make review boxes right with avatar! pass in enriched comment object? */}
      <Text>
        highReview - {highReview}
        lowReview - {lowReview}
      </Text>
    </Box>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
