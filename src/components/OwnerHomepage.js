import React from "react";
import {
  Box,
  CircularProgress,
  Button,
  Text,
  useDisclosure,
  Heading,
} from "@chakra-ui/core";
import axios from "axios";

import RestaurantListItem from "components/RestaurantListItem";
import AddRestaurantModal from "components/AddRestaurantModal";
import { getAuthHeader } from "utils";

const OwnerHomepage = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setIsLoading(true);

    fetchRestaurants({
      setIsLoading,
      setRestaurants,
    }).then(() => setIsLoading(false));
  }, []);

  const handleCreateRestaurant = async () => {
    setIsLoading(true);
    await fetchRestaurants({
      setIsLoading,
      setRestaurants,
    });
    setIsLoading(false);
    onClose();
  };

  const fetchRestaurants = async ({ setIsLoading, setRestaurants }) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants/me`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {});
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }
  const reviews = ["TODO"];

  return (
    <Box p={4}>
      <Heading>Your Restaurants</Heading>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
      <Heading>Unreplied Reviews</Heading>
      <Box>
        {reviews.map((review) => (
          <div>w000t</div>
        ))}
      </Box>
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateRestaurant}
      />
    </Box>
  );
};

export default OwnerHomepage;
