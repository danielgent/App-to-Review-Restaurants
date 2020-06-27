import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Text, Flex } from "@chakra-ui/core";

const RestaurantListItem = ({ restaurant }) => {
  const { name, _id, averageRating } = restaurant;
  // average rating
  return (
    <Link to={`/restaurant/${_id}`}>
      <Flex p={4} border="1px solid black" mb={2}>
        <Text>{name}</Text>
        <Text>{averageRating}</Text>
      </Flex>
    </Link>
  );
};

RestaurantListItem.propTypes = {};

export default RestaurantListItem;
