import React from "react";
import {
  Box,
  CircularProgress,
  Button,
  useDisclosure,
  Text,
  Flex,
} from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import AddRestaurantModal from "components/AddRestaurantModal";
import AddReplyModal from "components/AddReplyModal";
import CommentItem from "components/CommentItem";
import { Container, Heading } from "components/Styled";
import { authAxios } from "utils";

const fetchRestaurants = async () =>
  authAxios
    .get(`${process.env.REACT_APP_API_URL}/restaurants/me`)
    .then((response) => response.data);

const fetchReviews = async () =>
  authAxios
    .get(`${process.env.REACT_APP_API_URL}/reviews/me/unreplied`)
    .then((response) => response.data);

const OwnerHomepage = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviewIdToReply, setReviewIdToReply] = React.useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setIsLoading(true);

    fetchRestaurants()
      .then((restaurants) => {
        setRestaurants(restaurants);
        return fetchReviews();
      })
      .then((reviews) => {
        setReviews(reviews);
        setIsLoading(false);
      });
  }, []);

  const handleCreateRestaurant = async () => {
    setIsLoading(true);
    const restaurants = await fetchRestaurants();
    setRestaurants(restaurants);

    setIsLoading(false);
    onClose();
  };

  const handleReplyToReview = async () => {
    const reviews = await fetchReviews();
    setReviews(reviews);
    setReviewIdToReply();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={700}>
      <Heading>Your Restaurants</Heading>
      <Box mb={16}>
        {restaurants.map((restaurant) => (
          <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
        ))}
      </Box>
      <Heading>Unreplied Reviews</Heading>
      <Box>
        {reviews.length === 0 ? (
          <Text>All your reviews are replied to</Text>
        ) : (
          reviews.map((review) => (
            <Box key={review._id} mb={4}>
              <CommentItem review={review} />
              <Flex justifyContent="flex-end">
                <Button mb={4} onClick={() => setReviewIdToReply(review._id)}>
                  Reply
                </Button>
              </Flex>
            </Box>
          ))
        )}
      </Box>
      <AddReplyModal
        isOpen={!!reviewIdToReply}
        onClose={() => setReviewIdToReply(null)}
        onSubmit={handleReplyToReview}
        reviewId={reviewIdToReply}
      />
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateRestaurant}
      />
    </Container>
  );
};

export default OwnerHomepage;
