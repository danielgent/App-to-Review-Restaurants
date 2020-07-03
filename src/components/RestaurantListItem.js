import React from "react";
import { Link } from "react-router-dom";
import { Text, Flex } from "@chakra-ui/core";

const RestaurantListItem = ({ restaurant }) => {
  const { name, _id, averageRating } = restaurant;
  return (
    <Link to={`/restaurant/${_id}`}>
      <Flex
        p={4}
        border="1px solid black"
        rounded="lg"
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>{name}</Text>
        <Text>{averageRating}</Text>
      </Flex>
    </Link>
  );
};

export default RestaurantListItem;
