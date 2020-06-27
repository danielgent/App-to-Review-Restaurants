import React from "react";
import { Box, Heading, Text, CircularProgress } from "@chakra-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

// import restaurants from "fixtures/restaurants";
// import reviews from "fixtures/reviews";

import CommentItem from "components/CommentItem";

const SectionTitle = (props) => (
  <Heading as="h2" size="md" mb={6} color="gray.600" {...props} />
);

const Section = (props) => <Box padding={2} mb={4} {...props} />;

const Restaurant = () => {
  let { id } = useParams();

  const [restaurant, setRestaurant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/restaurants/${id}`)
      .then((response) => {
        setRestaurant(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  // FAKE BE BIT---------------------------------------------------
  // const restaurant = restaurants.find((r) => r.id === id);

  // const highReview = reviews.find((r) => r.id === restaurant.highReview);
  // const lowReview = reviews.find((r) => r.id === restaurant.lowReview);

  // const recentReviews = reviews.filter((r) => r.restaurant === id);

  // ------------------------------------------------------------------

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  const { name, averageRating, highReview, lowReview } = restaurant;

  // TODO NEXT...
  const recentReviews = [];

  return (
    <Box p={4}>
      <Heading as="h1">{name}</Heading>
      <Text>Avg {averageRating}</Text>
      <Section>
        <SectionTitle>Top review</SectionTitle>
        <CommentItem review={highReview} />
      </Section>
      <Section>
        <SectionTitle>Worst review</SectionTitle>
        <CommentItem review={lowReview} />
      </Section>

      <Section>
        <SectionTitle>Recent reviews</SectionTitle>
        {recentReviews.map((review) => (
          <CommentItem key={review.id} review={review} />
        ))}
      </Section>
    </Box>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
