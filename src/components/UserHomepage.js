import React from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/core";

import { getAuthHeader } from "utils";
import RestaurantListItem from "components/RestaurantListItem";

const UserHomepage = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [restaurants, setRestaurants] = React.useState([]);
  const [filters, setFilters] = React.useState({ min: 1, max: 5 });

  React.useEffect(() => {
    setIsLoading(true);
    axios
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
    <Box p={4}>
      <Box p={4}>
        <FormControl>
          <FormLabel htmlFor="username">
            Select minimum average rating
          </FormLabel>
          <Select value={filters.min} onChange={handleMinRatingChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="username">
            Select maximum average rating
          </FormLabel>
          <Select value={filters.max} onChange={handleMaxRatingChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </Select>
        </FormControl>
      </Box>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
    </Box>
  );
};

UserHomepage.propTypes = {};

export default UserHomepage;
