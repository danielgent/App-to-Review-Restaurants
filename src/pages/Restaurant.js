import React from "react";
import {
  Box,
  Heading,
  Text,
  CircularProgress,
  useDisclosure,
} from "@chakra-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

// import restaurants from "fixtures/restaurants";
// import reviews from "fixtures/reviews";

import CommentItem from "components/CommentItem";
import AddReviewModal from "components/AddReviewModal";

const SectionTitle = (props) => (
  <Heading as="h2" size="md" mb={6} color="gray.600" {...props} />
);

const Section = (props) => <Box padding={2} mb={4} {...props} />;

const refetch = ({ setIsLoading, setRestaurant, id }) => {
  setIsLoading(true);
  axios
    .get(`${process.env.REACT_APP_API_URL}/restaurants/${id}`)
    .then((response) => {
      setRestaurant(response.data);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

const Restaurant = () => {
  let { id } = useParams();

  const [restaurant, setRestaurant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    refetch({
      setIsLoading,
      setRestaurant,
      id,
    });
  }, [id]);

  const handleSubmit = () => {
    refetch({
      setIsLoading,
      setRestaurant,
      id,
    });
    onClose();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  const {
    name,
    averageRating,
    highReview,
    lowReview,
    recentReviews,
  } = restaurant;

  const innerContent =
    recentReviews.length === 0 ? (
      <Text>No reviews yet</Text>
    ) : (
      <>
        <Text>Avg {averageRating}</Text>
        <Section
          backgroundColor="green.100"
          borderColor="green.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Top review</SectionTitle>
          <CommentItem review={highReview} />
        </Section>
        <Section
          backgroundColor="red.100"
          borderColor="red.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Worst review</SectionTitle>
          <CommentItem review={lowReview} />
        </Section>
        <Section>
          <SectionTitle>Recent reviews</SectionTitle>
          {recentReviews.map((review) => (
            <CommentItem key={review._id} review={review} />
          ))}
        </Section>
      </>
    );

  return (
    <Box p={4}>
      <Heading as="h1">{name}</Heading>
      {innerContent}
      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        restaurantId={id}
      />
    </Box>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
