import React from "react";
import {
  Box,
  CircularProgress,
  Select,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import { Container, Divider, Heading } from "components/Styled";
import { getAuthHeader, authAxios } from "utils";

const DEFAULT_FILTERS = { min: "", max: "" };

const UserHomepage = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [filters, setFilters] = React.useState(DEFAULT_FILTERS);

  React.useEffect(() => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        params: {
          ratingMin: filters.min,
          ratingMax: filters.max,
        },
        headers: getAuthHeader(),
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filters]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleMinRatingChange = (e) => {
    const min = e.target.value;
    let max = filters.max;
    if (min > max) {
      max = min;
    }
    setFilters({ max, min });
  };

  const handleMaxRatingChange = (e) => {
    const max = e.target.value;

    let min = filters.min;
    if (max < min) {
      min = max;
    }
    setFilters({ max, min });
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={700}>
      <Heading as="h1">View all restaurants</Heading>

      <Box p={4}>
        <FormControl>
          <FormLabel htmlFor="minRating">
            Select minimum average rating
          </FormLabel>
          <Select
            id="minRating"
            value={filters.min}
            onChange={handleMinRatingChange}
          >
            <option value={""}>none</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="maxRating">
            Select maximum average rating
          </FormLabel>
          <Select
            id="maxRating"
            value={filters.max}
            onChange={handleMaxRatingChange}
          >
            <option value={""}>none</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
          <Button onClick={handleClearFilters}>Clear filters</Button>
        </FormControl>
        <Divider />
      </Box>
      {restaurants.length === 0
        ? "no results"
        : restaurants.map((restaurant) => (
            <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
          ))}
    </Container>
  );
};

UserHomepage.propTypes = {};

export default UserHomepage;
