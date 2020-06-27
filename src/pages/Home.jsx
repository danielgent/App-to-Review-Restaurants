import React from "react";
import { Box } from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import restaurants from "fixtures/restaurants";

// TODO - create component-examples page and move all that there for development and reference. DIY styleguide

const Home = (props) => {

return (  <Box p={4}>
  {restaurants.map((restaurant) => (
    <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
  ))}
</Box>
)
};

Home.propTypes = {};

export default Home;
