import React from "react";
import {
  Box,
  CircularProgress,
  Button,
  Text,
  useDisclosure,
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
    refetch({
      setIsLoading,
      setRestaurants,
    });
  }, []);

  const handleSubmit = () => {
    refetch({
      setIsLoading,
      setRestaurants,
    });
    onClose();
  };

  const refetch = ({ setIsLoading, setRestaurants }) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants/me`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Box p={4}>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
      <Text fontSize="xl">TODO - put list of unreplied reviews here</Text>
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default OwnerHomepage;
