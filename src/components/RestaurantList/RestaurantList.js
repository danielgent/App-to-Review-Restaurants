// this component not worth it. MVP. Just have basic components and build out on pages
import React from "react";
import { Box } from "@chakra-ui/core";

import RestaurantListItem from "./RestaurantListItem";

const RestaurantList = ({ restaurants }) => {
  return (
    <Box p={4}>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
      ))}
    </Box>
  );
};

RestaurantList.propTypes = {};

export default RestaurantList;
