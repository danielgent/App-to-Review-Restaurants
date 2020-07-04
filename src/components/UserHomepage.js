import React from "react";
import { Box, CircularProgress, Flex } from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import { Container, Heading } from "components/Styled";
import Filters from "components/Filters";

import { authAxios } from "utils";

const UserHomepage = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [minRating, setMinRating] = React.useState(null);

  React.useEffect(() => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        params: {
          ratingMin: minRating,
        },
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [minRating]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={1200}>
      <Heading as="h1">View all restaurants</Heading>
      <Flex>
        <Filters
          onChange={setMinRating}
          value={minRating}
          flexGrow={0}
          flexBasis="250px"
          py={8}
        />
        <Box p={4} flexGrow={1}>
          {restaurants.length === 0
            ? "no results"
            : restaurants.map((restaurant) => (
                <RestaurantListItem
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))}
        </Box>
      </Flex>
    </Container>
  );
};

UserHomepage.propTypes = {};

export default UserHomepage;
