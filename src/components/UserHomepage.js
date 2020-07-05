import React from "react";
import { Box, Flex } from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import { Container, Heading } from "components/Styled";
import Filters from "components/Filters";
import Pagination from "components/Pagination";
import GlobalLoading from "components/GlobalLoading";

import { authAxios } from "utils";

const UserHomepage = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [minRating, setMinRating] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        params: {
          ratingMin: minRating,
          page,
        },
      })
      .then((response) => {
        setRestaurants(response.data.results);
        setTotalPages(response.data.totalPages);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [minRating, page]);

  return (
    <Container maxWidth={1200}>
      <Heading as="h1">View all restaurants</Heading>
      <Flex flexDirection={{ xs: "column", md: "row" }}>
        <Filters
          onChange={setMinRating}
          value={minRating}
          flexGrow={0}
          flexBasis="250px"
          py={8}
        />
        <Box p={4} flexGrow={1}>
          {isLoading ? (
            <GlobalLoading h="300px" />
          ) : restaurants.length === 0 ? (
            "no results"
          ) : (
            <>
              <Box mb={8}>
                {restaurants.map((restaurant) => (
                  <RestaurantListItem
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
              </Box>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default UserHomepage;
