import React from "react";
import axios from "axios";
import {
  CircularProgress,
  SimpleGrid,
  Text,
  useToast,
  Button,
} from "@chakra-ui/core";

import { getAuthHeader } from "utils";
import EditRestaurantModal from "components/EditRestaurantModal";
import ConfirmationModal from "components/ConfirmationModal";
import { Container, Heading, TableCell } from "components/Styled";

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

const ViewRestaurants = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [restaurantToEdit, setRestaurantToEdit] = React.useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = React.useState(null);

  const toast = useToast();

  const fetchRestaurants = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleUpdateRestaurant = () => {
    fetchRestaurants();
    setRestaurantToEdit(null);
  };
  const handleDeleteRestaurant = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/restaurants/${restaurantToDelete._id}`,
        {
          headers: getAuthHeader(),
        }
      )
      .then(function (response) {
        toast({
          description: "Restaurant succesfully deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setRestaurantToDelete();
        fetchRestaurants();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={1200}>
      <Heading>View restaurants</Heading>
      <SimpleGrid
        columns={3}
        borderColor="gray.600"
        borderWidth="1px"
        borderStyle="solid"
        borderRight="none"
        borderBottom="none"
      >
        <TableCell>
          <HeaderText>Restaurant name</HeaderText>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        {restaurants.map((restaurant) => (
          <React.Fragment key={restaurant._id}>
            <TableCell>{restaurant.name}</TableCell>
            <TableCell p={2}>
              <Button onClick={() => setRestaurantToEdit(restaurant)}>
                Edit restaurant
              </Button>
            </TableCell>
            <TableCell p={2}>
              <Button onClick={() => setRestaurantToDelete(restaurant)}>
                Delete restaurant
              </Button>
            </TableCell>
          </React.Fragment>
        ))}
      </SimpleGrid>
      <EditRestaurantModal
        isOpen={!!restaurantToEdit}
        onClose={() => setRestaurantToEdit(null)}
        onSubmit={handleUpdateRestaurant}
        restaurant={restaurantToEdit}
      />
      <ConfirmationModal
        isOpen={!!restaurantToDelete}
        onClose={() => setRestaurantToDelete(null)}
        onConfirm={handleDeleteRestaurant}
      >
        Are you sure you want to delete {restaurantToDelete?.name}? All reviews
        will also be deleted
      </ConfirmationModal>
    </Container>
  );
};

export default ViewRestaurants;
