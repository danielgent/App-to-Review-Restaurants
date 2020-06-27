import React from "react";
import { Box, CircularProgress, Button, useDisclosure } from "@chakra-ui/core";
import axios from "axios";

import RestaurantListItem from "components/RestaurantListItem";
import AddRestaurantModal from "components/AddRestaurantModal";

// import restaurants from "fixtures/restaurants";

const Home = (props) => {
  const [restaurants, setRestaurants] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [
    filters,
    // setFilters
  ] = React.useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        params: filters,
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
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

Home.propTypes = {};

export default Home;
