import React from "react";

import RestaurantList from "components/RestaurantList";
import restaurants from "fixtures/restaurants";

// TODO - create component-examples page and move all that there for development and reference. DIY styleguide

const Home = (props) => {
  return <RestaurantList restaurants={restaurants} />;
};

Home.propTypes = {};

export default Home;
