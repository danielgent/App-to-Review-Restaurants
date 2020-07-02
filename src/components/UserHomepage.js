import React from "react";
import axios from "axios";
import { Box, CircularProgress } from "@chakra-ui/core";

import { getAuthHeader } from "utils";
import RestaurantListItem from "components/RestaurantListItem";

const UserHomepage = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [
    filters,
    // TODO - filter by avg. rating
    // setFilters
  ] = React.useState({});

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        params: filters,
        headers: getAuthHeader(),
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Box p={4}>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
    </Box>
  );
};

UserHomepage.propTypes = {};

export default UserHomepage;
