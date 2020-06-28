import React from "react";
import { Box, CircularProgress, Button, useDisclosure } from "@chakra-ui/core";
import axios from "axios";

import RestaurantListItem from "components/RestaurantListItem";
import AddRestaurantModal from "components/AddRestaurantModal";
import UserContext from "contexts/user-context";

const refetch = ({ setIsLoading, setRestaurants, filters, token }) => {
  setIsLoading(true);
  axios
    .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setRestaurants(response.data);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

const Home = (props) => {
  const { user } = React.useContext(UserContext);
  const [restaurants, setRestaurants] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [
    filters,
    // setFilters
  ] = React.useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    refetch({
      token: user.token,
      setIsLoading,
      setRestaurants,
      filters,
    });
  }, [filters, user.token]);

  const handleSubmit = () => {
    refetch({
      token: user.token,
      setIsLoading,
      setRestaurants,
      filters,
    });
    onClose();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Box p={4}>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

Home.propTypes = {};

export default Home;
