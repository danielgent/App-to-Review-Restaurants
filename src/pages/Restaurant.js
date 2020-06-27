import React from "react";
import { Box, Heading, Text } from "@chakra-ui/core";
import { useParams } from "react-router-dom";

// doing joins on FE for now. Read up on this a bit
import restaurants from "fixtures/restaurants";
import reviews from "fixtures/reviews";
// import users from "fixtures/users";
// 1. get working quickest way. 2. optimise later. will be small project. do hardest parts first
// remmeber that totally failed last time in obvious ways

import CommentItem from "components/CommentItem";

const SectionTitle = (props) => (
  <Heading as="h2" size="md" mb={6} color="gray.600" {...props} />
);

const Section = (props) => <Box padding={2} mb={4} {...props} />;

const Restaurant = () => {
  let { id } = useParams();

  // FAKE BE BIT---------------------------------------------------
  const restaurant = restaurants.find((r) => r.id === id);

  const highReview = reviews.find((r) => r.id === restaurant.highReview);
  const lowReview = reviews.find((r) => r.id === restaurant.lowReview);

  const recentReviews = reviews.filter((r) => r.restaurant === id);

  // ------------------------------------------------------------------

  const { name, averageRating } = restaurant;

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
