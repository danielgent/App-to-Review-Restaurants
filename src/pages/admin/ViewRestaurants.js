import React from "react";
import { CircularProgress, Text, useToast, Button } from "@chakra-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import EditRestaurantModal from "components/EditRestaurantModal";
import ConfirmationModal from "components/ConfirmationModal";
import { Container, Heading } from "components/Styled";
import { authAxios } from "utils";

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

const ViewRestaurants = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [restaurantToEdit, setRestaurantToEdit] = React.useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = React.useState(null);

  const toast = useToast();

  const fetchRestaurants = () => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`)
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
    authAxios
      .delete(
        `${process.env.REACT_APP_API_URL}/restaurants/${restaurantToDelete._id}`
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
      <Table>
        <TableHead>
          <TableCell>
            <HeaderText>Restaurant name</HeaderText>
          </TableCell>
          <TableCell />
          <TableCell />
        </TableHead>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant._id}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
